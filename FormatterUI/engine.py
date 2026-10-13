"""ARIA 4X offline formatter engine. Standard-library orchestrator, no npm or downloads."""
from __future__ import annotations
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import subprocess
import sys
import tempfile
import threading
import time
import uuid
import zipfile
from dataclasses import dataclass
from typing import Callable

THIS = Path(__file__).resolve().parent
ROOT = THIS.parent
DEPS_ZIP = THIS / 'offline-dependencies.zip'
CACHE = THIS / '.cache'
BACKUPS = THIS / 'backups'
REPORTS = THIS / 'reports'
SAFE_VERSION = (2, 80, 0)
MODULE_FROM = 'moduleFolder:"/4X/Modules/"'
MODULE_TO = 'moduleFolder:"/4X/Min/"'
ALLOW_FORMAT = {'.js', '.json', '.css', '.html', '.htm'}

class FormatterError(RuntimeError):
    pass

@dataclass(frozen=True)
class Options:
    format: bool = True
    minify: bool = True
    bundle: bool = True
    switch_module_path: bool = True

    @classmethod
    def from_json(cls, values):
        if not isinstance(values, dict):
            raise FormatterError('The requested options are invalid.')
        fields=('format','minify','bundle','switch_module_path')
        if set(values)-set(fields):
            raise FormatterError('Unexpected operation option.')
        vals={k:values.get(k, True) for k in fields}
        if any(type(v) is not bool for v in vals.values()):
            raise FormatterError('Operation options must be true or false.')
        if not any(vals.values()):
            raise FormatterError('Select at least one operation.')
        if vals['switch_module_path'] and not vals['minify']:
            raise FormatterError('Path switching requires minifying the core first.')
        return cls(**vals)


def sha256(data:bytes)->str:
    return hashlib.sha256(data).hexdigest()


def assert_repo(root:Path=ROOT):
    required=['Format.sh','BuildBundle.js','rollup.config.js','4X/4X.Max.js','4X/4X.Max.Export.js','4X/Standard/Modules/AccName.js']
    missing=[f for f in required if not (root/f).is_file()]
    if missing:
        raise FormatterError('This program must be in the Apex4X repository root; missing: '+', '.join(missing))


def safe_file(root:Path, rel:str|Path)->Path:
    p=PurePosixPath(str(rel).replace('\\','/'))
    if p.is_absolute() or not p.parts or '..' in p.parts or any(a in ('','.','..') for a in p.parts):
        raise FormatterError('Unsafe path: '+str(rel))
    target=root.joinpath(*p.parts)
    if not target.resolve().is_relative_to(root.resolve()):
        raise FormatterError('Target escapes root: '+str(rel))
    # never follow symlinks in staged or original trees
    for part in [root,*[root.joinpath(*p.parts[:i]) for i in range(1,len(p.parts)+1)]]:
        if part.is_symlink():
            raise FormatterError('Symlink encountered: '+str(rel))
    return target


def iter_tree(root:Path,base:str,exts:set[str],recursive=True):
    p=safe_file(root,base)
    if not p.is_dir():return
    for item in sorted(p.rglob('*') if recursive else p.glob('*')):
        if item.is_symlink(): raise FormatterError('Refusing symbolic link in '+base+': '+str(item))
        if item.is_file() and item.suffix.lower() in exts:
            yield item.relative_to(root).as_posix()


def prettier_targets(root=ROOT):
    targets=[]
    for f in ['4X/4X.Max.js','4X/4X.Max.Export.js','index.htm','index.js','rollup.config.js']:
        if safe_file(root,f).is_file():targets.append(f)
    targets.extend(iter_tree(root,'4X',{'.css'},True))
    for loc in ('4X/Modules','4X/Standard/Modules'):
        targets.extend(iter_tree(root,loc,{'.js','.json'},False))
    targets.extend(iter_tree(root,'React/src',{'.js','.json','.css'},True))
    for loc in ('Templates','Tutorials','WhatSock'):
        targets.extend(iter_tree(root,loc,ALLOW_FORMAT,True))
    return sorted(set(targets))


def minification_pairs(root=ROOT):
    # Derive ONLY the original, publisher-authored UglifyJS steps; never execute Format.sh as shell.
    source=(root/'Format.sh').read_text(encoding='utf-8-sig')
    pairs=[]
    pat=re.compile(r'^uglifyjs\s+(\S+)\s+--comments\s+--compress\s+--mangle\s+--output\s+(\S+)\s+2>>\s+FormatErrors\.txt\s*$',re.I)
    for line in source.splitlines():
        if not line.strip().startswith('uglifyjs '):continue
        m=pat.fullmatch(line.strip())
        if not m: raise FormatterError('Unsupported UglifyJS instruction in original Format.sh: '+line.strip()[:200])
        src,dst=m.group(1),m.group(2)
        src_p=safe_file(root,src); dst_p=safe_file(root,dst)
        if not src_p.is_file():raise FormatterError('Original minification source missing: '+src)
        if not (src=='4X/4X.Max.js' and dst=='4X/4X.js'):
            source_family=PurePosixPath(src).parts
            target_family=PurePosixPath(dst).parts
            if len(source_family)!=4 or len(target_family)!=4 or source_family[0]!='4X' or source_family[1] not in ('Modules','Standard'):
                # dynamic modules: 4X/Modules/x.js -> three parts; standard: four parts.
                if not (src.startswith('4X/Modules/') and dst.startswith('4X/Min/') and PurePosixPath(src).name==PurePosixPath(dst).name) and not (src.startswith('4X/Standard/Modules/') and dst.startswith('4X/Standard/Min/') and PurePosixPath(src).name==PurePosixPath(dst).name):
                    raise FormatterError('Minification path is not a verified Apex4X module: '+src)
            if src.startswith('4X/Modules/') and not (dst=='4X/Min/'+PurePosixPath(src).name):
                raise FormatterError('Unexpected target: '+dst)
            if src.startswith('4X/Standard/Modules/') and not (dst=='4X/Standard/Min/'+PurePosixPath(src).name):
                raise FormatterError('Unexpected target: '+dst)
        pairs.append((src,dst))
    if len(pairs)<20:raise FormatterError('Too few minification operations found in Format.sh')
    if len(set(d for s,d in pairs))!=len(pairs):raise FormatterError('Duplicate minification output')
    return pairs


def get_plan(root=ROOT, options=Options()):
    assert_repo(root)
    fmts=prettier_targets(root) if options.format else []
    mins=minification_pairs(root) if options.minify else []
    # Source staging for original Rollup config's imports.
    return {'root':str(root),'format_files':len(fmts),'minify_files':len(mins),
            'build_bundle':options.bundle,'update_module_path':options.switch_module_path,
            'estimated_outputs':len(set(fmts)|{d for _,d in mins}|({'Bundle/4X.js'} if options.bundle else set())),
            'tool_versions':{'prettier':'3.9.10','uglify-js':'3.19.3','rollup':'2.80.0'}}


def ensure_deps(log:Callable[[str],None]=print):
    if not DEPS_ZIP.is_file():
        raise FormatterError('Offline dependencies missing: FormatterUI/offline-dependencies.zip')
    digest=sha256(DEPS_ZIP.read_bytes())
    CACHE.mkdir(parents=True,exist_ok=True)
    version_file=CACHE/'vendor-sha256.txt'
    target=CACHE/'node_modules'
    if version_file.is_file() and version_file.read_text().strip()==digest and target.joinpath('rollup/package.json').is_file() and target.joinpath('prettier/package.json').is_file() and target.joinpath('uglify-js/package.json').is_file():
        log('Offline dependencies are already prepared.')
    else:
        log('Extracting packaged offline tools (first run only)...')
        tmp=CACHE/('unpack-'+uuid.uuid4().hex)
        tmp.mkdir()
        try:
            total=0
            with zipfile.ZipFile(DEPS_ZIP) as z:
                if z.testzip():raise FormatterError('Offline dependency ZIP has damaged files.')
                for entry in z.infolist():
                    if entry.is_dir():continue
                    path=PurePosixPath(entry.filename.replace('\\','/'))
                    if path.is_absolute() or '..' in path.parts or not path.parts or path.parts[0]!='node_modules':
                        raise FormatterError('Unsafe dependency member: '+entry.filename)
                    if stat.S_IFMT(entry.external_attr>>16)==stat.S_IFLNK:
                        raise FormatterError('Symlinks not allowed inside offline dependency package.')
                    if entry.file_size>25000000:raise FormatterError('Unexpected dependency file size: '+entry.filename)
                    total+=entry.file_size
                    if total>200000000:raise FormatterError('Offline dependency package exceeds configured limit.')
                    out=tmp.joinpath(*path.parts)
                    out.parent.mkdir(parents=True,exist_ok=True)
                    with z.open(entry) as src,out.open('wb') as dst: shutil.copyfileobj(src,dst)
            # versions must match the shipped known-good set
            expected={'prettier':'3.9.10','uglify-js':'3.19.3','rollup':'2.80.0'}
            for name,want in expected.items():
                file=tmp/'node_modules'/name/'package.json'
                version=json.loads(file.read_text(encoding='utf-8'))['version']
                if version!=want:raise FormatterError(f'Incorrect packaged {name} version: {version}; expected {want}')
            old=CACHE/('old-'+uuid.uuid4().hex)
            if target.exists():target.rename(old)
            try:
                (tmp/'node_modules').rename(target)
                version_file.write_text(digest+'\n',encoding='utf-8')
            except BaseException:
                if old.exists() and not target.exists():old.rename(target)
                raise
            if old.exists():shutil.rmtree(old)
        finally:
            if tmp.exists():shutil.rmtree(tmp)
    # patch enforcement: must not accidentally use project /node_modules/rollup
    rollup=json.loads((target/'rollup/package.json').read_text())['version']
    if tuple(int(n) for n in rollup.split('.')[:3])<SAFE_VERSION:
        raise FormatterError('Unsafe Rollup version; minimum 2.80.0')
    return target


def prepare_stage(root:Path,stage:Path,formats:list[str],pairs:list[tuple[str,str]],options:Options):
    # No duplicate node_modules or installed packages from repository.
    paths=set(formats)
    if safe_file(root,'package.json').is_file():paths.add('package.json')
    if options.minify:
        paths.update(s for s,d in pairs)
    if options.bundle:
        paths.update({'BuildBundle.js','rollup.config.js','package.json'})
        for p in iter_tree(root,'4X',{'.js','.css','.json'},True): paths.add(p)
    # Config files are copied, but are not written back unless explicitly a formatting target.
    for x in ['.prettierrc','.prettierrc.json','.prettierrc.yaml','.prettierrc.yml','.prettier.config.js','.prettierignore']:
        if (root/x).is_file():paths.add(x)
    original={}
    outputs=set(formats)|({d for _,d in pairs})|({'Bundle/4X.js'} if options.bundle else set())
    for p in sorted(paths|outputs):
        target=safe_file(root,p)
        original[p]=sha256(target.read_bytes()) if target.is_file() else None
    for p in sorted(paths):
        a=safe_file(root,p)
        if not a.is_file():raise FormatterError('Input unexpectedly missing: '+p)
        b=safe_file(stage,p);b.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(a,b)
    return original


def run_command(cmd:list[str],cwd:Path,logger,stage:str,timeout=180):
    logger(stage+': '+str(len(cmd)-2)+' arguments; running locally...')
    env=os.environ.copy()
    env.update({'NO_UPDATE_NOTIFIER':'1','npm_config_offline':'true','BROWSERSLIST_IGNORE_OLD_DATA':'1'})
    try:
        cp=subprocess.run(cmd,cwd=str(cwd),stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,errors='replace',encoding='utf-8',timeout=timeout,env=env)
    except subprocess.TimeoutExpired:
        raise FormatterError(stage+' took too long and was stopped; no repository files were changed.')
    if cp.returncode:
        logger((cp.stderr or cp.stdout)[-3000:])
        raise FormatterError(f'{stage} failed (exit {cp.returncode}): '+(cp.stderr or cp.stdout).strip()[-1200:])
    if cp.stderr and cp.stderr.strip():logger(stage+' messages: '+cp.stderr.strip()[-700:])
    return cp.stdout


def write_backup(root:Path,changed:dict[str,bytes],original_bytes:dict[str,bytes|None],options:Options,log):
    run_id=time.strftime('%Y%m%d-%H%M%S')+'-'+uuid.uuid4().hex[:7]
    backup=BACKUPS/run_id
    backup.mkdir(parents=True,exist_ok=False)
    rec=[]
    for rel,new in sorted(changed.items()):
        old=original_bytes[rel]
        if old is not None:
            dest=safe_file(backup/'original',rel)
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(old)
        rec.append({'path':rel,'existed':old is not None,'old_sha256':sha256(old) if old is not None else None,'new_sha256':sha256(new),'bytes_new':len(new)})
    meta={'format4x_version':'1.0.0','created':time.strftime('%Y-%m-%dT%H:%M:%S%z'),
          'options':vars(options),'files':rec,'status':'prepared'}
    (backup/'manifest.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
    return backup,meta


def commit(root:Path,stage:Path,candidates:set[str],options:Options,log,initial_hashes:dict[str,str|None]):
    changed={}; original_bytes={}
    for rel in sorted(candidates):
        dst=safe_file(root,rel)
        src=safe_file(stage,rel)
        if not src.is_file():raise FormatterError('Missing expected generated output '+rel)
        new=src.read_bytes()
        old=dst.read_bytes() if dst.is_file() else None
        if (sha256(old) if old is not None else None)!=initial_hashes.get(rel):
            raise FormatterError('Repository file changed during preparation, refusing overwrite: '+rel)
        if new!=old:
            changed[rel]=new;original_bytes[rel]=old
    if not changed:return {'changed':0,'backup':None,'paths':[]}
    backup,meta=write_backup(root,changed,original_bytes,options,log)
    # Commit after *all* formatting/minifying/building/syntax checks succeed.
    # Refuse to touch files changed externally between snapshot and commit.
    applied=[]
    try:
        for rel,new in sorted(changed.items()):
            dst=safe_file(root,rel)
            previous=dst.read_bytes() if dst.is_file() else None
            if previous!=original_bytes[rel]:raise FormatterError('File changed externally while processing: '+rel)
            dst.parent.mkdir(parents=True,exist_ok=True)
            tmp=dst.parent/(dst.name+'.aria4x-temp-'+uuid.uuid4().hex)
            try:
                tmp.write_bytes(new);os.replace(tmp,dst)
            finally:
                if tmp.exists():tmp.unlink()
            applied.append(rel)
        meta['status']='complete'
        (backup/'manifest.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
        shown=backup.relative_to(root) if backup.is_relative_to(root) else backup
        log(f'Applied {len(changed)} changed/new files; backup at '+str(shown))
        return {'changed':len(changed),'backup':str(shown),'paths':sorted(changed)}
    except Exception:
        for rel in reversed(applied):
            dst=safe_file(root,rel)
            old=original_bytes[rel]
            if old is None:dst.unlink(missing_ok=True)
            else:dst.write_bytes(old)
        meta['status']='rolled_back'
        (backup/'manifest.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
        raise


def restore_backup(root:Path=ROOT,backup_name:str|None=None,log=print):
    candidates=sorted([x for x in BACKUPS.iterdir() if x.is_dir()]) if BACKUPS.is_dir() else []
    candidates=[x for x in candidates if (x/'manifest.json').is_file() and json.loads((x/'manifest.json').read_text(encoding='utf-8')).get('status')=='complete']
    if not candidates:raise FormatterError('No completed backup is available to restore.')
    backup=candidates[-1] if backup_name is None else BACKUPS/backup_name
    if not backup.is_dir() or not backup.resolve().is_relative_to(BACKUPS.resolve()):
        raise FormatterError('Requested backup does not exist.')
    metadata=json.loads((backup/'manifest.json').read_text(encoding='utf-8'))
    if metadata.get('status')!='complete':raise FormatterError('The backup is not a completed formatting run.')
    for item in metadata['files']:
        path=safe_file(root,item['path'])
        now=sha256(path.read_bytes()) if path.is_file() else None
        if now!=item['new_sha256']:
            raise FormatterError('Refusing restore: a file changed since this backup: '+item['path'])
    for item in metadata['files']:
        path=safe_file(root,item['path'])
        if item['existed']:
            src=safe_file(backup/'original',item['path'])
            if sha256(src.read_bytes())!=item['old_sha256']:
                raise FormatterError('Backup integrity check failed: '+item['path'])
    for item in metadata['files']:
        path=safe_file(root,item['path'])
        if item['existed']:
            path.parent.mkdir(parents=True,exist_ok=True)
            src=safe_file(backup/'original',item['path'])
            tmp=path.parent/(path.name+'.aria4x-restore-'+uuid.uuid4().hex)
            tmp.write_bytes(src.read_bytes());os.replace(tmp,path)
        else:
            path.unlink(missing_ok=True)
    metadata['status']='restored'
    (backup/'manifest.json').write_text(json.dumps(metadata,indent=2)+'\n')
    log('Restored '+str(len(metadata['files']))+' paths from '+str(backup))
    return len(metadata['files'])


def perform(options:Options=Options(), root:Path=ROOT, log=print, stage_update=None):
    assert_repo(root)
    node=shutil.which('node')
    if not node:raise FormatterError('Node.js is not installed or is not in PATH. Node.js is required; NPM is not.')
    if options.switch_module_path and not options.minify:raise FormatterError('Path switching requires core minification.')
    log('ARIA 4X offline formatter -- original Format.sh operations')
    log('Repository: '+str(root))
    vendor=ensure_deps(log)
    format_items=prettier_targets(root) if options.format else []
    minify_items=minification_pairs(root) if options.minify else []
    workdir=CACHE/'jobs';workdir.mkdir(parents=True,exist_ok=True)
    stage=workdir/uuid.uuid4().hex
    stage.mkdir(parents=True,exist_ok=False)
    source_outputs=set(format_items)
    if options.minify:source_outputs.update(t for s,t in minify_items)
    if options.bundle:source_outputs.add('Bundle/4X.js')
    try:
        initial_hashes=prepare_stage(root,stage,format_items,minify_items,options)
        def run(cmd,phase,timeout=180): return run_command(cmd,stage,log,phase,timeout)
        if options.format:
            if stage_update:stage_update('Formatting source files with Prettier')
            log('Formatting '+str(len(format_items))+' files using Prettier 3.9.10 (staging only).')
            exe=str(vendor/'prettier/bin/prettier.cjs')
            # Short batches to stay well below the Windows command-line length limit.
            for start in range(0,len(format_items),30):
                batch=format_items[start:start+30]
                run([node,exe,'--write',*batch],f'Prettier {min(start+30,len(format_items))}/{len(format_items)}',timeout=180)
        if options.minify:
            if stage_update:stage_update('Minifying Apex4X core and modules')
            log('Minifying '+str(len(minify_items))+' outputs using original UglifyJS command flags (staging only).')
            exe=str(vendor/'uglify-js/bin/uglifyjs')
            for k,(src,dst) in enumerate(minify_items,1):
                safe_file(stage,dst).parent.mkdir(parents=True,exist_ok=True)
                run([node,exe,src,'--comments','--compress','--mangle','--output',dst],f'UglifyJS {k}/{len(minify_items)}',timeout=60)
        if options.bundle:
            if stage_update:stage_update('Rebuilding original Bundle/4X.js')
            log('Rebuilding Bundle/4X.js with patched offline Rollup 2.80.0 (ES module format).')
            (stage/'Bundle').mkdir(parents=True,exist_ok=True)
            exe=str(vendor/'rollup/dist/bin/rollup')
            run([node,exe,'-c'], 'Rollup bundle',timeout=180)
        if options.switch_module_path:
            if stage_update:stage_update('Applying original Save4X.py module-folder adjustment')
            core=safe_file(stage,'4X/4X.js')
            original=core.read_text(encoding='utf-8')
            if MODULE_FROM not in original:
                if MODULE_TO in original:log('Core already uses /4X/Min/.')
                else:raise FormatterError('Cannot find original moduleFolder setting in compiled core; refusing an unverified substitution.')
            else:
                core.write_text(original.replace(MODULE_FROM,MODULE_TO),encoding='utf-8')
                log('Switched generated 4X/4X.js moduleFolder from /4X/Modules/ to /4X/Min/.')
        if stage_update:stage_update('Checking generated JavaScript syntax')
        log('Validating generated output syntax with Node.js...')
        generated=[]
        if options.minify:generated.extend(dst for _,dst in minify_items)
        if options.bundle:generated.append('Bundle/4X.js')
        for k,path in enumerate(generated,1):
            # .js file extension honors Apex4X package.json type module
            run([node,'--check',str(safe_file(stage,path))],f'JavaScript syntax check {k}/{len(generated)}',timeout=25)
        if stage_update:stage_update('Backing up and applying verified changes')
        result=commit(root,stage,source_outputs,options,log,initial_hashes)
        log('DONE. Changes: '+str(result['changed']))
        result.update({'formatted':len(format_items),'minified':len(minify_items),'built_bundle':options.bundle,'module_path_switched':options.switch_module_path,'status':'PASS'})
        return result
    finally:
        shutil.rmtree(stage,ignore_errors=True)
