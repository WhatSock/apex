#!/usr/bin/env python3
"""ARIA 4X local-only, offline, accessible GUI for the original Apex4X Rollup builder.

Place beside BuildBundle.js, rollup.config.js, 4X/, and Bundle/.
Uses ONLY Python's standard library; compilation uses locally installed Node.js
and Rollup dependencies already in node_modules or the bundled offline archive.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import http.server
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import socket
import stat
import subprocess
import sys
import tempfile
import threading
import time
import urllib.parse
import uuid
import webbrowser
import zipfile

ROOT = Path(__file__).resolve().parent
UI = ROOT / 'BundleBuilderUI'
CACHE = UI / '.cache'
OUTPUT_DIR = UI / 'output'
DEPS_ZIP = UI / 'compiler-dependencies.zip'
DEPS_ZIP_SHA256 = 'c57c7789d761120996517e3cfa3a3f19c456672121856f61b6eacc3bd668853c'
MAX_DEPS_UNPACKED = 100_000_000
MAX_DEPS_FILES = 5000
BUILD_TIMEOUT = 240

# Exactly the modules and ordering from Apex 4X's BuildBundle.js.
ORDER = [
    'CurrentDevice', 'Dragdealer', 'Dragula', 'TinySlider', 'Velocity',
    'VelocityUI', 'AccName', 'Animate', 'RovingTabIndex', 'SmoothScroll',
    'Beep', 'Accordion', 'Button', 'Carousel', 'Combobox', 'Datepicker',
    'Dialog', 'Drag', 'Footnote', 'Grid', 'Listbox', 'Menu', 'Popup',
    'Slider', 'Tab', 'Tooltip', 'Tree', 'Straylight',
]

# Exact dependencies from Help/Module Dependency Index.txt; CSS assets loaded after JS,
# as in the original BuildBundle.js. Straylight imports the complete suite.
DEPS = {
    'VelocityUI': ['Velocity'],
    'Animate': ['Velocity', 'VelocityUI'],
    'RovingTabIndex': ['AccName'],
    'SmoothScroll': ['Velocity', 'VelocityUI', 'Animate'],
    'Accordion': ['AccName', 'RovingTabIndex'],
    'Button': ['AccName', 'RovingTabIndex'],
    'Carousel': ['TinySlider'],
    'Combobox': ['Velocity', 'VelocityUI', 'Animate', 'SmoothScroll', 'AccName', 'CurrentDevice'],
    'Drag': ['Dragula', 'Velocity', 'VelocityUI', 'Animate', 'AccName', 'RovingTabIndex', 'Menu'],
    'Footnote': ['Velocity', 'VelocityUI', 'Animate', 'SmoothScroll'],
    'Listbox': ['AccName', 'RovingTabIndex'],
    'Menu': ['AccName', 'RovingTabIndex'],
    'Slider': ['CurrentDevice', 'Dragdealer'],
    'Tab': ['AccName', 'RovingTabIndex'],
    'Tree': ['AccName', 'RovingTabIndex'],
    'Straylight': [name for name in ORDER if name != 'Straylight'],
}
CSS = {'Dragula': 'Dragula.css', 'TinySlider': 'TinySlider.css'}
ALIASES = {'Checkbox': 'Button', 'Radio': 'Button', 'Switch': 'Button'}
WIDGETS = [
    ('Accordion', 'Accordion'), ('Button', 'Button'), ('Carousel', 'Carousel'),
    ('Checkbox', 'Checkbox (uses Button)'), ('Combobox', 'Combobox'),
    ('Datepicker', 'Datepicker'), ('Dialog', 'Dialog'), ('Drag', 'Drag and drop'),
    ('Footnote', 'Footnote'), ('Grid', 'Grid'), ('Listbox', 'Listbox'),
    ('Menu', 'Menu'), ('Popup', 'Popup'), ('Radio', 'Radio (uses Button)'),
    ('Slider', 'Slider'), ('Switch', 'Switch (uses Button)'), ('Tab', 'Tabs'),
    ('Tooltip', 'Tooltip'), ('Tree', 'Tree'),
]
UTILITIES = [(m, m) for m in (
    'AccName', 'Animate', 'Beep', 'CurrentDevice', 'Dragdealer',
    'Dragula', 'RovingTabIndex', 'SmoothScroll', 'TinySlider',
    'Velocity', 'VelocityUI',
)]
SPECIAL = [('Straylight', 'Straylight (includes the entire module suite)')]
VALID_CHOICES = {x[0] for x in WIDGETS + UTILITIES + SPECIAL}
OUTPUT_RE = re.compile(r'^[A-Za-z0-9][A-Za-z0-9._-]{0,59}\.js$')


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for b in iter(lambda: f.read(1024 * 1024), b''):
            h.update(b)
    return h.hexdigest()


def verify_root() -> list[str]:
    files = [ROOT / 'BuildBundle.js', ROOT / 'rollup.config.js',
             ROOT / '4X/4X.Max.Export.js', ROOT / 'package.json',
             ROOT / 'Help/Module Dependency Index.txt']
    return [str(p.relative_to(ROOT)) for p in files if not p.is_file()]


def plan(requested: list[str]) -> dict:
    if not isinstance(requested, list) or len(requested) > 90 or any(not isinstance(x, str) or x not in VALID_CHOICES for x in requested):
        raise ValueError('Invalid module list. Choose from the provided checkbox labels.')
    choices = list(dict.fromkeys(requested))
    effective = [ALIASES.get(n, n) for n in choices]
    closure = set(effective)
    pending = list(closure)
    while pending:
        current = pending.pop()
        for dep in DEPS.get(current, []):
            if dep not in closure:
                closure.add(dep)
                pending.append(dep)
    ordered = [name for name in ORDER if name in closure]
    css = [CSS[m] for m in ORDER if m in closure and m in CSS]
    explicit = set(effective)
    implicit = [m for m in ordered if m not in explicit]
    return {
        'requested': choices, 'modules': ordered, 'autoAdded': implicit,
        'css': css, 'core': '4X/4X.Max.Export.js',
        'aliases': {name: ALIASES[name] for name in choices if name in ALIASES},
    }


def generate_entry(mods: list[str], css: list[str], entry_parent: Path) -> str:
    src = []
    for path in (['4X/4X.Max.Export.js'] +
                 ['4X/Standard/Modules/' + m + '.js' for m in mods] +
                 ['4X/Standard/Modules/' + c for c in css]):
        rel = Path(os.path.relpath(ROOT / path, entry_parent)).as_posix()
        if not rel.startswith('.'):
            rel = './' + rel
        src.append('import ' + json.dumps(rel) + ';')
    return '// Generated by ARIA 4X Bundle Builder; do not edit the original BuildBundle.js.\n' + '\n'.join(src) + '\n'


def portable_build_script(mods: list[str], css: list[str]) -> str:
    src = ['// Generated by ARIA 4X Bundle Builder; original BuildBundle.js remains unchanged.',
           'import "./4X/4X.Max.Export.js"; // Core API is always required.']
    src.extend('import "./4X/Standard/Modules/' + m + '.js";' for m in mods)
    src.extend('import "./4X/Standard/Modules/' + c + '";' for c in css)
    return '\n'.join(src) + '\n'


def offline_deps() -> Path:
    """Choose installed dependencies, or extract only bundled, integrity-checked offline deps."""
    root_rollup = ROOT / 'node_modules/rollup/dist/bin/rollup'
    if root_rollup.is_file():
        return ROOT / 'node_modules'
    target = CACHE / 'node_modules'
    binary = target / 'rollup/dist/bin/rollup'
    if binary.is_file() and (CACHE / '.offline-deps-sha256').is_file() and (CACHE / '.offline-deps-sha256').read_text().strip() == DEPS_ZIP_SHA256:
        return target
    if not DEPS_ZIP.is_file():
        raise RuntimeError('Neither root node_modules nor the bundled compiler-dependencies.zip was found.')
    if sha256(DEPS_ZIP) != DEPS_ZIP_SHA256:
        raise RuntimeError('Bundled offline dependencies failed their SHA-256 integrity check.')
    # Extract into a newly created directory and replace cache atomically.
    CACHE.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='aria4x-deps-', dir=str(CACHE)) as staging:
        staging = Path(staging)
        count = 0
        size = 0
        with zipfile.ZipFile(DEPS_ZIP) as z:
            if z.testzip():
                raise RuntimeError('Offline compiler archive CRC check failed.')
            for info in z.infolist():
                name = PurePosixPath(info.filename)
                if (name.is_absolute() or '..' in name.parts or '\\' in info.filename
                        or not name.parts or name.parts[0] != 'node_modules'
                        or stat.S_IFMT(info.external_attr >> 16) == stat.S_IFLNK):
                    raise RuntimeError('Unsafe entry in offline dependency archive')
                if info.is_dir():
                    continue
                count += 1
                size += info.file_size
                if count > MAX_DEPS_FILES or size > MAX_DEPS_UNPACKED:
                    raise RuntimeError('Offline compiler archive exceeds configured limits')
                dest = staging.joinpath(*name.parts)
                dest.parent.mkdir(parents=True, exist_ok=True)
                with z.open(info) as inp, dest.open('wb') as out:
                    shutil.copyfileobj(inp, out)
        if not (staging / 'node_modules/rollup/dist/bin/rollup').is_file():
            raise RuntimeError('Offline compiler does not contain Rollup')
        if target.exists():
            shutil.rmtree(target)
        shutil.move(str(staging / 'node_modules'), str(target))
        (CACHE / '.offline-deps-sha256').write_text(DEPS_ZIP_SHA256 + '\n', encoding='utf-8')
    return target


def get_output_filename(payload: dict) -> str:
    if payload.get('replaceStock') is True:
        return '4X.js'
    name = payload.get('filename', '4X.Custom.js')
    if not isinstance(name, str) or not OUTPUT_RE.fullmatch(name):
        raise ValueError('Output name must be a simple .js filename, such as 4X.Custom.js (no paths).')
    if name.lower() == '4x.js':
        raise ValueError('Use the explicit Replace stock bundle checkbox to write Bundle/4X.js.')
    return name


def assert_source_exists(p: dict) -> None:
    missing = verify_root()
    missing += [f'4X/Standard/Modules/{m}.js' for m in p['modules'] if not (ROOT / f'4X/Standard/Modules/{m}.js').is_file()]
    missing += [f'4X/Standard/Modules/{m}' for m in p['css'] if not (ROOT / f'4X/Standard/Modules/{m}').is_file()]
    if missing:
        raise ValueError('Required Apex4X repository files are missing: ' + ', '.join(missing))


def run_checked(command: list[str], *, cwd: Path, timeout: int) -> subprocess.CompletedProcess:
    return subprocess.run(command, cwd=cwd, capture_output=True, text=True,
                          encoding='utf-8', errors='replace', timeout=timeout,
                          stdin=subprocess.DEVNULL, shell=False,
                          env={**os.environ, 'NO_COLOR': '1', 'FORCE_COLOR': '0'})


class JobStore:
    def __init__(self):
        self.lock = threading.RLock()
        self.jobs: dict[str, dict] = {}
        self.active: str | None = None

    def create(self, data: dict) -> dict:
        with self.lock:
            if self.active:
                raise RuntimeError('A compilation is already in progress. Please wait for it to finish.')
            ident = uuid.uuid4().hex[:16]
            record = {'id': ident, 'state': 'queued', 'message': 'Compilation queued.',
                      'log': '', 'requested': data['modules'], 'outputFilename': get_output_filename(data)}
            self.jobs[ident] = record
            self.active = ident
            # Conserve memory; downloadable files persist on disk, but job links are session-based.
            if len(self.jobs) > 30:
                for k in list(self.jobs):
                    if k != self.active and self.jobs[k]['state'] in ('done', 'error'):
                        del self.jobs[k]
                        if len(self.jobs) <= 24:
                            break
            return record.copy()

    def modify(self, ident: str, **changes):
        with self.lock:
            self.jobs[ident].update(changes)

    def finish(self, ident: str):
        with self.lock:
            if self.active == ident:
                self.active = None

    def get(self, ident: str):
        with self.lock:
            rec = self.jobs.get(ident)
            return rec.copy() if rec else None

JOBS = JobStore()


def build(ident: str, payload: dict) -> None:
    log: list[str] = []

    def note(message: str):
        log.append(message)
        JOBS.modify(ident, log='\n'.join(log)[-60000:], message=message)

    try:
        JOBS.modify(ident, state='running')
        p = plan(payload['modules'])
        filename = get_output_filename(payload)
        assert_source_exists(p)
        note('Selected: ' + (', '.join(p['requested']) if p['requested'] else 'Core only'))
        note('Resolved JavaScript modules: ' + (', '.join(p['modules']) if p['modules'] else 'none'))
        note('Bundled CSS: ' + (', '.join(p['css']) if p['css'] else 'none'))
        node = shutil.which('node')
        if not node:
            raise RuntimeError('Node.js is not installed or not on PATH. Install Node.js to compile offline.')
        version = run_checked([node, '--version'], cwd=ROOT, timeout=15)
        if version.returncode:
            raise RuntimeError('Node.js cannot be executed: ' + version.stderr)
        note('Using Node.js ' + version.stdout.strip())
        note('Locating offline Rollup dependencies...')
        deps_path = offline_deps()
        note('Compiler packages: ' + ('repository node_modules' if deps_path == ROOT / 'node_modules' else 'bundled offline cache'))
        # Copy the original rollup config to the same folder as fallback node_modules so
        # Node can resolve plugins without any npm/network operation. This is a copy, not an edit.
        config = CACHE / 'rollup.gui.config.mjs'
        if deps_path == ROOT / 'node_modules':
            config = ROOT / 'rollup.config.js'
        else:
            config.write_bytes((ROOT / 'rollup.config.js').read_bytes())
        CACHE.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix='build-', dir=str(CACHE)) as scratch:
            scratch = Path(scratch)
            entry = scratch / 'BuildBundle.generated.js'
            entry.write_text(generate_entry(p['modules'], p['css'], scratch), encoding='utf-8')
            compiled = scratch / '4X.compile.js'
            rollup = deps_path / 'rollup/dist/bin/rollup'
            if not rollup.is_file():
                raise RuntimeError('Installed rollup entrypoint is missing: ' + str(rollup))
            note('Running original Rollup config (no network requests)...')
            args = [node, str(rollup), '-c', str(config), '--input', str(entry),
                    '--file', str(compiled), '--format', 'esm']
            result = run_checked(args, cwd=ROOT, timeout=BUILD_TIMEOUT)
            if result.stdout.strip():
                log.append(result.stdout.strip()[-30000:])
            if result.stderr.strip():
                log.append(result.stderr.strip()[-30000:])
            if result.returncode:
                raise RuntimeError(f'Rollup failed with exit code {result.returncode}. Review compiler output below.')
            if not compiled.is_file() or compiled.stat().st_size < 256:
                raise RuntimeError('Rollup reported success but did not write a usable bundle.')
            syntax = run_checked([node, '--check', str(compiled)], cwd=ROOT, timeout=30)
            if syntax.returncode:
                log.append(syntax.stderr[-15000:])
                raise RuntimeError('Generated JavaScript failed node --check.')
            note('PASS: generated JavaScript passed node --check.')
            # Package first, and only after success publish the output to Bundle/.
            OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
            project_bundle = ROOT / 'Bundle' / filename
            project_bundle.parent.mkdir(parents=True, exist_ok=True)
            manifest = {
                'tool': 'ARIA 4X Offline Bundle Builder', 'timestampUTC': dt.datetime.now(dt.timezone.utc).isoformat(),
                'sourcePackageVersion': json.loads((ROOT / 'package.json').read_text(encoding='utf-8-sig')).get('version'),
                'sourceRollupConfigSHA256': sha256(ROOT / 'rollup.config.js'),
                'sourceEntryBuildBundleSHA256': sha256(ROOT / 'BuildBundle.js'),
                'requestedModules': p['requested'], 'resolvedModules': p['modules'],
                'automaticallyAddedModules': p['autoAdded'], 'includedCSS': p['css'],
                'aliases': p['aliases'], 'outputFilename': filename,
                'compiledSHA256': sha256(compiled), 'compiledSize': compiled.stat().st_size,
                'syntaxCheck': 'PASS', 'runtimeBrowserCheck': 'NOT RUN', 'manualATCheck': 'NOT RUN',
            }
            portable = portable_build_script(p['modules'], p['css'])
            download_zip = OUTPUT_DIR / f'ARIA4X-bundle-{ident}.zip'
            with zipfile.ZipFile(download_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
                z.write(compiled, f'Bundle/{filename}')
                z.writestr('BuildBundle.generated.js', portable)
                z.writestr('build-manifest.json', json.dumps(manifest, indent=2) + '\n')
                z.writestr('README.txt',
                    'ARIA 4X custom JavaScript bundle\n\n'
                    f'Built from the current Apex4X repository. Load Bundle/{filename} as configured in your application.\n'
                    'The compiled JS includes the requested modules, their dependencies, and any required injected CSS.\n'
                    'Original BuildBundle.js and rollup.config.js were not modified.\n'
                    'JavaScript syntax was checked; browser or screen-reader behavior was NOT tested.\n'
                    'See build-manifest.json for included modules, SHA-256 and source version.\n')
                license_file = ROOT / 'LICENSE.md'
                if license_file.is_file():
                    z.write(license_file, 'LICENSE.md')
            if download_zip.stat().st_size <= 1000 or zipfile.ZipFile(download_zip).testzip() is not None:
                raise RuntimeError('Compiled package failed ZIP validation.')
            backup = None
            if project_bundle.is_file():
                stamp = dt.datetime.now().strftime('%Y%m%d-%H%M%S')
                backup = ROOT / 'Bundle' / f'{filename}.backup-{stamp}-{ident}'
                shutil.copy2(project_bundle, backup)
            staging = project_bundle.with_name(project_bundle.name + f'.tmp-{ident}')
            shutil.copy2(compiled, staging)
            os.replace(staging, project_bundle)
            note(f'PASS: wrote {project_bundle.relative_to(ROOT).as_posix()} ({project_bundle.stat().st_size:,} bytes).')
            if backup:
                note(f'Previous output backed up to {backup.relative_to(ROOT).as_posix()}')
            note(f'PASS: bundle ZIP saved to {download_zip.relative_to(ROOT).as_posix()}')
            JOBS.modify(ident, state='done', message='Compilation successful. JavaScript syntax passed.',
                        log='\n'.join(log)[-60000:], zipPath=str(download_zip), jsPath=str(project_bundle),
                        manifest=manifest)
    except subprocess.TimeoutExpired:
        log.append('Build timed out. Original Bundle/4X.js and BuildBundle.js were not changed.')
        JOBS.modify(ident, state='error', message='Compilation timed out.', log='\n'.join(log)[-60000:])
    except Exception as exc:
        log.append('ERROR: ' + str(exc))
        JOBS.modify(ident, state='error', message=str(exc), log='\n'.join(log)[-60000:])
    finally:
        JOBS.finish(ident)


class Handler(http.server.BaseHTTPRequestHandler):
    server_version = 'ARIA4XLocalBuilder/1.0'

    def log_message(self, fmt: str, *args):
        # Minimize browser request noise; useful messages still go to the console.
        if '/api/' not in self.path and not self.path.startswith('/favicon'):
            print('HTTP ' + fmt % args)

    def _trusted_request(self) -> bool:
        host = self.headers.get('Host', '')
        if host not in ('127.0.0.1:' + str(self.server.server_port),
                        'localhost:' + str(self.server.server_port)):
            return False
        return True

    def _headers(self, code: int, content_type: str, size: int, *, download_name: str | None = None):
        self.send_response(code)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(size))
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('Referrer-Policy', 'no-referrer')
        if download_name:
            safe = re.sub(r'[^A-Za-z0-9_.-]', '_', download_name)
            self.send_header('Content-Disposition', f'attachment; filename="{safe}"')
        self.end_headers()

    def json_response(self, code: int, obj: dict):
        data = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self._headers(code, 'application/json; charset=utf-8', len(data))
        self.wfile.write(data)

    def text_response(self, code: int, text: str):
        data = text.encode('utf-8')
        self._headers(code, 'text/plain; charset=utf-8', len(data))
        self.wfile.write(data)

    def _serve_file(self, path: Path, media: str, attachment: str | None = None):
        if not path.is_file():
            return self.text_response(404, 'Not found')
        size = path.stat().st_size
        self._headers(200, media, size, download_name=attachment)
        with path.open('rb') as f:
            shutil.copyfileobj(f, self.wfile, length=1024 * 1024)

    def do_GET(self):
        if not self._trusted_request():
            return self.text_response(403, 'Invalid Host header')
        url = urllib.parse.urlsplit(self.path)
        path = url.path
        if path in ('/', '/index.html'):
            return self._serve_file(UI / 'index.html', 'text/html; charset=utf-8')
        if path == '/style.css':
            return self._serve_file(UI / 'style.css', 'text/css; charset=utf-8')
        if path == '/app.js':
            return self._serve_file(UI / 'app.js', 'text/javascript; charset=utf-8')
        if path == '/api/modules':
            return self.json_response(200, {
                'categories': [
                    {'name': 'Accessible widgets', 'options': [{'id': n, 'label': l} for n, l in WIDGETS]},
                    {'name': 'Utility modules', 'options': [{'id': n, 'label': l} for n, l in UTILITIES]},
                    {'name': 'Complete suite', 'options': [{'id': n, 'label': l} for n, l in SPECIAL]},
                ],
                'missingRootFiles': verify_root(),
                'offlineCompilerIncluded': DEPS_ZIP.is_file(),
            })
        if re.fullmatch(r'/api/status/[0-9a-f]{16}', path):
            ident = path.rsplit('/', 1)[-1]
            job = JOBS.get(ident)
            if not job:
                return self.json_response(404, {'error': 'Unknown build ID'})
            job.pop('jsPath', None)
            job.pop('zipPath', None)
            if job['state'] == 'done':
                job['downloads'] = {'javascript': f'/download/{ident}/javascript', 'zip': f'/download/{ident}/zip'}
            return self.json_response(200, job)
        if re.fullmatch(r'/download/[0-9a-f]{16}/(javascript|zip)', path):
            _, _, ident, kind = path.split('/')
            job = JOBS.get(ident)
            if not job or job['state'] != 'done':
                return self.text_response(404, 'Build file not available')
            if kind == 'javascript':
                return self._serve_file(Path(job['jsPath']), 'text/javascript; charset=utf-8', job['outputFilename'])
            return self._serve_file(Path(job['zipPath']), 'application/zip', Path(job['zipPath']).name)
        return self.text_response(404, 'Not found')

    def do_POST(self):
        if not self._trusted_request():
            return self.json_response(403, {'error': 'Invalid Host header'})
        origin = self.headers.get('Origin', '')
        if origin not in (f'http://127.0.0.1:{self.server.server_port}',
                          f'http://localhost:{self.server.server_port}'):
            return self.json_response(403, {'error': 'Invalid or missing request Origin'})
        if self.headers.get('Content-Type', '').split(';')[0].strip().lower() != 'application/json':
            return self.json_response(415, {'error': 'JSON required'})
        try:
            size = int(self.headers.get('Content-Length', '-1'))
        except ValueError:
            size = -1
        if size < 0 or size > 65536:
            return self.json_response(413, {'error': 'Invalid request size'})
        try:
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict):
                raise ValueError('JSON object required')
            p = plan(data.get('modules', []))
            filename = get_output_filename(data)
        except (ValueError, TypeError, json.JSONDecodeError) as exc:
            return self.json_response(400, {'error': str(exc)})
        if self.path == '/api/plan':
            return self.json_response(200, {'plan': p, 'outputFilename': filename})
        if self.path == '/api/build':
            try:
                job = JOBS.create(data)
            except (RuntimeError, ValueError) as exc:
                return self.json_response(409, {'error': str(exc)})
            threading.Thread(target=build, args=(job['id'], data), daemon=True).start()
            return self.json_response(202, {'id': job['id'], 'state': job['state']})
        return self.json_response(404, {'error': 'Unknown endpoint'})


def serve(port: int, open_browser: bool):
    missing = verify_root()
    if missing:
        print('ERROR: This program must be placed at the Apex4X repo root. Missing: ' + ', '.join(missing), file=sys.stderr)
        return 2
    if not shutil.which('node'):
        print('ERROR: Node.js not found in PATH. Please install Node.js before compiling.', file=sys.stderr)
        return 2
    try:
        srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler)
    except OSError as exc:
        print('Unable to start local server: ' + str(exc), file=sys.stderr)
        return 2
    srv.daemon_threads = True
    url = f'http://127.0.0.1:{srv.server_port}/'
    print('\nARIA 4X offline bundle builder (local-only)', flush=True)
    print('Open this address in your browser: ' + url, flush=True)
    print('All build activity stays on this computer. Press Ctrl+C to stop.\n', flush=True)
    if open_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever(poll_interval=0.2)
    except KeyboardInterrupt:
        print('\nStopping ARIA 4X builder.')
    finally:
        srv.server_close()
    return 0


def main():
    ap = argparse.ArgumentParser(description='Run an offline accessible local web UI to compile custom Apex4X bundles.')
    ap.add_argument('--port', type=int, default=8766, help='Loopback port, default 8766; 0 chooses any free port')
    ap.add_argument('--no-browser', action='store_true', help='Print URL without opening browser')
    args = ap.parse_args()
    if args.port < 0 or args.port > 65535:
        ap.error('Port must be between 0 and 65535')
    return serve(args.port, not args.no_browser)


if __name__ == '__main__':
    sys.exit(main())
