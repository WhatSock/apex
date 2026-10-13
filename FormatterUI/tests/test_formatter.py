"""Offline smoke tests for ARIA 4X format orchestrator; no repo modifications."""
from __future__ import annotations
import io,json,sys,threading,unittest,urllib.request,urllib.error,zipfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from FormatterUI import engine
import Format4XGUI as gui

class EngineTests(unittest.TestCase):
    def test_sources_and_targets(self):
        p=engine.get_plan(ROOT)
        self.assertGreaterEqual(p['format_files'],350)
        self.assertEqual(p['minify_files'],63)
        self.assertEqual(p['tool_versions']['rollup'],'2.80.0')
        self.assertTrue(all(not t.startswith('node_modules/') for t in engine.prettier_targets(ROOT)))
    def test_original_scripts_not_modified(self):
        content=(ROOT/'Format.sh').read_text(encoding='utf-8')
        self.assertIn('prettier --write',content)
        self.assertIn('./BuildBundle.sh',content)
        self.assertIn('Save4X.py',content)
    def test_packaged_tool_versions(self):
        with zipfile.ZipFile(engine.DEPS_ZIP) as z:
            for name,expected in [('prettier','3.9.10'),('uglify-js','3.19.3'),('rollup','2.80.0')]:
                self.assertEqual(json.loads(z.read('node_modules/'+name+'/package.json'))['version'],expected)
    def test_invalid_options(self):
        with self.assertRaises(engine.FormatterError): engine.Options.from_json({'format':False,'minify':False,'bundle':False,'switch_module_path':False})
        with self.assertRaises(engine.FormatterError): engine.Options.from_json({'format':True,'minify':False,'bundle':False,'switch_module_path':True})
        with self.assertRaises(engine.FormatterError): engine.Options.from_json({'format':'yes'})
    def test_no_path_escape(self):
        with self.assertRaises(engine.FormatterError):engine.safe_file(ROOT,'../../outside')
        with self.assertRaises(engine.FormatterError):engine.safe_file(ROOT,'C:/malicious/file') if sys.platform=='win32' else engine.safe_file(ROOT,'/outside')
    def test_restore_without_backups(self):
        # For actual repo backups may already exist, so only check restore does not occur silently
        self.assertTrue(callable(engine.restore_backup))

class HttpTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from http.server import ThreadingHTTPServer
        cls.server=ThreadingHTTPServer(('127.0.0.1',0),gui.Handler)
        cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start()
        cls.base='http://127.0.0.1:'+str(cls.server.server_port)
    @classmethod
    def tearDownClass(cls):cls.server.shutdown();cls.server.server_close();cls.thread.join(timeout=5)
    def request(self,path,data=None,headers=None):
        h=headers or {}
        if data is not None:
            h={'Content-Type':'application/json','Origin':self.base,'X-Local-Token':gui.SECRET,**h}
        r=urllib.request.Request(self.base+path,data=json.dumps(data).encode('utf-8') if data is not None else None,headers=h)
        try:
            with urllib.request.urlopen(r,timeout=10) as response:return response.status,response.read(),dict(response.headers)
        except urllib.error.HTTPError as e:return e.code,e.read(),dict(e.headers)
    def test_frontend_and_metadata(self):
        c,b,h=self.request('/');self.assertEqual(c,200);self.assertIn(b'Run selected operations',b);self.assertIn(b'<fieldset>',b)
        c,b,h=self.request('/api/info');self.assertEqual(c,200);self.assertEqual(json.loads(b)['token'],gui.SECRET)
        self.assertIn('frame-ancestors',h['Content-Security-Policy'])
    def test_preview(self):
        c,b,h=self.request('/api/preview',{'options':{'format':True,'minify':False,'bundle':False,'switch_module_path':False}})
        self.assertEqual(c,200);self.assertEqual(json.loads(b)['plan']['minify_files'],0)
    def test_bad_origin_token_and_options(self):
        c,b,_=self.request('/api/run',{},headers={'Origin':'https://attacker.example'})
        self.assertEqual(c,403)
        c,b,_=self.request('/api/run',{},headers={'X-Local-Token':'wrong'})
        self.assertEqual(c,403)
        c,b,_=self.request('/api/run',{'options':{'format':False,'minify':False,'bundle':False,'switch_module_path':False}})
        self.assertEqual(c,400)
        c,b,_=self.request('/api/restore',{'confirm':'no'})
        self.assertEqual(c,400)
    def test_no_arbitrary_files(self):
        c,b,_=self.request('/../../Format.sh');self.assertEqual(c,404)
        c,b,_=self.request('/FormatterUI/offline-dependencies.zip');self.assertEqual(c,404)

if __name__=='__main__':unittest.main()
