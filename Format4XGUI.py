#!/usr/bin/env python3
"""Local accessible web UI for original Apex4X Format.sh; no npm, no internet."""
from __future__ import annotations
import argparse
from datetime import datetime
from functools import partial
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import secrets
import shutil
import sys
import threading
import time
from urllib.parse import urlsplit
import webbrowser

from FormatterUI import engine

ROOT=Path(__file__).resolve().parent
UI=ROOT/'FormatterUI'
STATE_LOCK=threading.Lock()
STATE={'state':'idle','phase':'Ready','message':'No run started','recent_logs':[],'all_logs':[],'started':None,'finished':None,'result':None,'last_report':None}
SECRET=secrets.token_urlsafe(32)


def write_log(text):
    text=str(text).strip().replace('\r','')
    if not text:return
    with STATE_LOCK:
        STATE['recent_logs']=(STATE['recent_logs']+[text])[-100:]
        STATE['all_logs'].append(text)
    print(text,flush=True)


def set_state(**vals):
    with STATE_LOCK:STATE.update(vals)


def snapshot():
    with STATE_LOCK:return {**STATE,'recent_logs':STATE['recent_logs'][:],'all_logs':STATE['all_logs'][:]}


def run_worker(options,restore=False):
    with STATE_LOCK:
        STATE.update(state='running',phase='Starting',message='Running offline',recent_logs=[],all_logs=[],result=None,started=datetime.now().isoformat(timespec='seconds'),finished=None)
    try:
        if restore:
            result={'restored':engine.restore_backup(root=ROOT,log=write_log),'status':'PASS'}
        else:
            result=engine.perform(options,ROOT,write_log,lambda phase:set_state(phase=phase))
        set_state(state='pass',phase='Complete',message='All requested operations completed successfully.',result=result)
    except BaseException as exc:
        set_state(state='fail',phase='Failed (repository not partially updated)',message=str(exc),result={'error':str(exc),'status':'FAIL'})
        write_log('ERROR: '+str(exc))
    finally:
        set_state(finished=datetime.now().isoformat(timespec='seconds'))
        try:
            engine.REPORTS.mkdir(parents=True,exist_ok=True)
            stamp=datetime.now().strftime('%Y%m%d-%H%M%S')
            report=engine.REPORTS/('Format4X-'+stamp+'-'+secrets.token_hex(3)+'.txt')
            st=snapshot()
            lines=['ARIA 4X OFFLINE FORMAT REPORT','',f"Time started: {st['started']}",f"Time finished: {st['finished']}",f"Result: {st['state']}",f"Details: {st['message']}",'', 'OUTPUT:',json.dumps(st.get('result'),indent=2),'','RUN LOG:',*st['all_logs']]
            report.write_text('\n'.join(lines)+'\n',encoding='utf-8')
            set_state(last_report=str(report))
        except Exception as exc:print('Unable to write report:',exc,flush=True)


def launch(options,restore=False):
    with STATE_LOCK:
        if STATE['state']=='running':return False
        STATE['state']='running'
    threading.Thread(target=run_worker,args=(options,restore),daemon=True).start()
    return True

class Handler(BaseHTTPRequestHandler):
    server_version='ARIA4XOfflineFormat/1.0'

    def log_message(self,fmt,*args):
        pass

    def address_ok(self):
        host=self.headers.get('Host','').lower()
        allowed={f'127.0.0.1:{self.server.server_port}',f'localhost:{self.server.server_port}'}
        return host in allowed

    def response(self,code,body:bytes,ctype='application/json; charset=utf-8',disposition=None):
        self.send_response(code)
        self.send_header('Content-Type',ctype)
        self.send_header('Content-Length',str(len(body)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('X-Frame-Options','DENY')
        self.send_header('Referrer-Policy','no-referrer')
        self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'")
        if disposition:self.send_header('Content-Disposition',disposition)
        self.end_headers();self.wfile.write(body)

    def json(self,obj,status=200):
        self.response(status,json.dumps(obj,ensure_ascii=False).encode('utf-8'))

    def do_GET(self):
        if not self.address_ok():return self.json({'error':'Invalid request host'},403)
        path=urlsplit(self.path).path
        if path=='/api/info':
            try:
                out={'token':SECRET,'plan':engine.get_plan(ROOT),'state':snapshot(),'offline':True,'note':'No npm or network downloads are used.'}
            except Exception as exc:out={'token':SECRET,'error':str(exc),'state':snapshot(),'offline':True}
            return self.json(out)
        if path=='/api/status':
            state=snapshot();state.pop('all_logs',None)
            return self.json(state)
        if path=='/api/report':
            p=snapshot()['last_report']
            if not p or not Path(p).is_file():return self.json({'error':'No report exists yet'},404)
            return self.response(200,Path(p).read_bytes(),'text/plain; charset=utf-8','attachment; filename="Format4X-report.txt"')
        files={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/style.css':'style.css'}
        if path in files:
            file=UI/files[path]
            typ='text/html; charset=utf-8' if file.suffix=='.html' else ('application/javascript; charset=utf-8' if file.suffix=='.js' else 'text/css; charset=utf-8')
            return self.response(200,file.read_bytes(),typ)
        return self.json({'error':'Not found'},404)

    def do_POST(self):
        if not self.address_ok():return self.json({'error':'Invalid request host'},403)
        valid={f'http://127.0.0.1:{self.server.server_port}',f'http://localhost:{self.server.server_port}'}
        if self.headers.get('Origin') not in valid:
            return self.json({'error':'Local origin required'},403)
        if self.headers.get('X-Local-Token')!=SECRET:
            return self.json({'error':'Invalid request token'},403)
        if self.headers.get('Content-Type','').split(';')[0].strip().lower()!='application/json':
            return self.json({'error':'JSON request required'},415)
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=4096:raise ValueError('Bad size')
            data=json.loads(self.rfile.read(size))
        except (ValueError,json.JSONDecodeError):return self.json({'error':'Invalid input'},400)
        path=urlsplit(self.path).path
        if path=='/api/preview':
            try:return self.json({'plan':engine.get_plan(ROOT,engine.Options.from_json(data.get('options',{})))})
            except Exception as exc:return self.json({'error':str(exc)},400)
        if path=='/api/run':
            try:
                opt=engine.Options.from_json(data.get('options',{}))
                engine.assert_repo(ROOT)
            except Exception as exc:return self.json({'error':str(exc)},400)
            if not launch(opt):return self.json({'error':'A formatting job is already running'},409)
            return self.json({'started':True},202)
        if path=='/api/restore':
            if data.get('confirm')!='RESTORE':return self.json({'error':'Explicit restore confirmation is required'},400)
            if not launch(engine.Options(),restore=True):return self.json({'error':'A job is already running'},409)
            return self.json({'started':True},202)
        return self.json({'error':'Unknown API request'},404)


def main():
    parser=argparse.ArgumentParser(description='ARIA 4X offline formatting interface: no npm, no network.')
    parser.add_argument('--port',type=int,default=8767)
    parser.add_argument('--no-browser',action='store_true')
    parser.add_argument('--run',action='store_true',help='Run full Format.sh-equivalent offline from Command Prompt (no UI).')
    parser.add_argument('--preview',action='store_true',help='Show operations without writing any source files.')
    parser.add_argument('--restore-last',action='store_true',help='Restore last fully completed backup only if files have not changed since.')
    parser.add_argument('--skip-format',action='store_true')
    parser.add_argument('--skip-minify',action='store_true')
    parser.add_argument('--skip-bundle',action='store_true')
    parser.add_argument('--skip-module-path',action='store_true')
    args=parser.parse_args()
    try:
        opts=engine.Options.from_json({'format':not args.skip_format,'minify':not args.skip_minify,'bundle':not args.skip_bundle,'switch_module_path':not args.skip_module_path})
        engine.assert_repo(ROOT)
        if args.preview:
            print(json.dumps(engine.get_plan(ROOT,opts),indent=2));return 0
        if args.restore_last:
            print('Restored:',engine.restore_backup(ROOT));return 0
        if args.run:
            result=engine.perform(opts,ROOT)
            print(json.dumps(result,indent=2));return 0
    except Exception as exc:
        print('ERROR:',exc,file=sys.stderr);return 1
    if not (1<=args.port<=65535):parser.error('Port must be between 1 and 65535')
    try:
        server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    except OSError as exc:
        print('ERROR: Cannot start local server on port',args.port,':',exc,file=sys.stderr)
        return 1
    url=f'http://127.0.0.1:{args.port}/'
    print('ARIA 4X Offline Formatter',flush=True)
    print('Local address:',url,flush=True)
    print('Press Ctrl+C in this window to stop. No internet connection is used.',flush=True)
    if not args.no_browser:
        threading.Timer(0.6,lambda:webbrowser.open(url)).start()
    try:server.serve_forever(poll_interval=0.25)
    except KeyboardInterrupt:print('\nShutting down.')
    finally:server.server_close()
    return 0

if __name__=='__main__':sys.exit(main())
