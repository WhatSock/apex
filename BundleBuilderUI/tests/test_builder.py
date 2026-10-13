"""Standard-library unit and HTTP tests for ARIA 4X offline module selection."""
import json
import sys
import threading
import unittest
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
import BuildBundleGUI as gui


class SelectionTests(unittest.TestCase):
    def test_vendored_rollup_is_patched(self):
        self.assertEqual(gui.rollup_version(gui.offline_deps()), (2, 80, 0))
        self.assertEqual(gui.sha256(gui.DEPS_ZIP), gui.DEPS_ZIP_SHA256)

    def test_legacy_root_rollup_is_not_preferred(self):
        # A repository may still have a vulnerable Rollup installed.
        offline = gui.offline_deps()
        self.assertNotEqual(offline, gui.ROOT / 'node_modules')
        self.assertEqual(gui.rollup_version(offline), (2, 80, 0))

    def test_reject_old_rollup_version(self):
        import tempfile
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'rollup'
            target.mkdir()
            (target / 'package.json').write_text('{"name":"rollup","version":"2.79.1"}')
            with self.assertRaises(RuntimeError):
                gui.rollup_version(Path(folder))

    def test_source_modules_are_exact(self):
        self.assertEqual(len(gui.ORDER), 28)
        self.assertTrue(set(gui.DEPS).issubset(gui.ORDER))
        self.assertEqual(gui.plan([])['modules'], [])
        self.assertEqual(gui.plan([])['css'], [])

    def test_auto_dependencies(self):
        p = gui.plan(['Combobox', 'Datepicker'])
        for m in ('Combobox', 'Datepicker', 'Velocity', 'VelocityUI', 'Animate', 'AccName', 'SmoothScroll', 'CurrentDevice'):
            self.assertIn(m, p['modules'])
        self.assertNotIn('Accordion', p['modules'])

    def test_css_dependencies(self):
        p = gui.plan(['Carousel', 'Drag'])
        self.assertEqual(p['css'], ['Dragula.css', 'TinySlider.css'])
        self.assertIn('Menu', p['modules'])

    def test_alias_modules(self):
        p = gui.plan(['Checkbox', 'Radio', 'Switch'])
        self.assertEqual(p['modules'], ['AccName', 'RovingTabIndex', 'Button'])
        self.assertEqual(p['aliases']['Checkbox'], 'Button')

    def test_full_bundle(self):
        p = gui.plan(['Straylight'])
        self.assertEqual(p['modules'], gui.ORDER)
        self.assertEqual(p['css'], ['Dragula.css', 'TinySlider.css'])

    def test_reject_invalid_inputs(self):
        for names in (['../oops'], ['BogusWidget'], 'Accordion', [''], ['Accordion.js']):
            with self.subTest(names=names), self.assertRaises(ValueError):
                gui.plan(names)
        for name in ('../../hack.js', '.hidden.js', '4X.js', 'out;touch.js', 'bad.txt'):
            with self.subTest(name=name), self.assertRaises(ValueError):
                gui.get_output_filename({'filename': name})
        self.assertEqual(gui.get_output_filename({'replaceStock': True}), '4X.js')

    def test_original_build_script_not_modified(self):
        p = gui.plan(['Accordion'])
        entry = gui.portable_build_script(p['modules'], p['css'])
        self.assertIn('import "./4X/4X.Max.Export.js";', entry)
        self.assertIn('import "./4X/Standard/Modules/AccName.js";', entry)
        self.assertNotIn('Straylight.js', entry)
        self.assertTrue((gui.ROOT / 'BuildBundle.js').is_file())


class APITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from http.server import ThreadingHTTPServer
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), gui.Handler)
        cls.server.daemon_threads = True
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = 'http://127.0.0.1:' + str(cls.server.server_port)

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=3)

    def test_ui_files(self):
        for path in ('/', '/index.html', '/style.css', '/app.js'):
            with self.subTest(path=path), urlopen(self.url + path, timeout=10) as response:
                self.assertEqual(response.status, 200)

    def test_module_api(self):
        with urlopen(self.url + '/api/modules', timeout=10) as r:
            data = json.load(r)
            options = [x['id'] for c in data['categories'] for x in c['options']]
            self.assertEqual(len(options), len(gui.WIDGETS) + len(gui.UTILITIES) + len(gui.SPECIAL))
            self.assertIn('Straylight', options)

    def test_preview_without_build(self):
        data = json.dumps({'modules': ['Accordion', 'Checkbox'], 'filename': '4X.Custom.js', 'replaceStock': False}).encode()
        req = Request(self.url + '/api/plan', data=data,
                      headers={'Content-Type': 'application/json', 'Origin': self.url})
        with urlopen(req, timeout=10) as r:
            response = json.load(r)
            self.assertIn('Button', response['plan']['modules'])
            self.assertIn('Accordion', response['plan']['modules'])

    def test_cross_origin_rejected(self):
        data = json.dumps({'modules': ['Accordion']}).encode()
        req = Request(self.url + '/api/build', data=data,
                      headers={'Content-Type': 'application/json', 'Origin': 'https://example.com'})
        with self.assertRaises(HTTPError) as err:
            urlopen(req, timeout=10)
        self.assertEqual(err.exception.code, 403)


if __name__ == '__main__':
    unittest.main()
