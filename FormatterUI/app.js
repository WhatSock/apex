'use strict';
let token = '';
let busy = false;
let lastState = '';
const ids = ['format', 'minify', 'bundle', 'switch_module_path'];
const $ = (id) => document.getElementById(id);

function selected() {
  return Object.fromEntries(ids.map(id => [id, $(id).checked]));
}
function text(id, value) { $(id).textContent = value; }
function controlsBusy(value) {
  busy = value;
  for (const id of ['preview','run','restore',...ids]) $(id).disabled = value;
  if (!value) $('switch_module_path').disabled = !$('minify').checked;
}
async function api(path, body) {
  const opts = body === undefined ? {} : {
    method:'POST',
    headers:{'Content-Type':'application/json','X-Local-Token':token},
    body:JSON.stringify(body)
  };
  const response = await fetch(path,opts);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}
function displayPlan(plan) {
  text('preview-text', `Repository: ${plan.root}. Prettier input files: ${plan.format_files}. ` +
    `Minified outputs: ${plan.minify_files}. Rebuild bundled 4X.js: ${plan.build_bundle ? 'yes' : 'no'}. ` +
    `Switch the core module path: ${plan.update_module_path ? 'yes' : 'no'}. ` +
    `Potential output files: ${plan.estimated_outputs}. ` +
    `Tools: Prettier ${plan.tool_versions.prettier}, UglifyJS ${plan.tool_versions['uglify-js']}, Rollup ${plan.tool_versions.rollup}.`);
}
async function preview() {
  try {
    const data = await api('/api/preview',{options:selected()});
    displayPlan(data.plan);
  } catch(err) {
    text('preview-text','Error: '+err.message);
  }
}
async function start(restore=false) {
  if (busy) return;
  if (restore && !window.confirm('Restore the latest successful formatting backup? This will revert that run, but only if files have not been changed since.')) return;
  try {
    const route = restore ? '/api/restore' : '/api/run';
    const body = restore ? {confirm:'RESTORE'} : {options:selected()};
    await api(route,body);
    controlsBusy(true);
    text('status',restore?'Restoring backup…':'Starting offline formatter…');
    $('logs-box').open = true;
  } catch(err) {
    text('status','Error: '+err.message);
  }
}
async function poll() {
  try {
    const info=await api('/api/status');
    if (info.state === 'running') {
      controlsBusy(true);
      text('status','Running: '+info.phase+'.');
    } else {
      if (busy) controlsBusy(false);
      if (info.state === 'pass') text('status','Completed successfully. '+(info.finished || ''));
      else if (info.state === 'fail') text('status','Failed: '+info.message);
      else if (lastState !== 'idle') text('status','Ready.');
    }
    lastState=info.state;
    const lines=info.recent_logs || [];
    text('log',lines.length?lines.join('\n'):'No run yet.');
    if (info.result) {
      if (info.state==='pass' && info.result.restored!==undefined) text('summary',`${info.result.restored} paths restored from backup.`);
      else if (info.state==='pass') text('summary',`${info.result.changed} changed files saved. Original formatting inputs: ${info.result.formatted}; minification outputs: ${info.result.minified}. Backup: ${info.result.backup || 'No changes were needed'}.`);
      else text('summary',info.message);
    }
    $('report').hidden=!info.last_report;
  } catch(err) {
    text('status','Could not read local processing status: '+err.message);
  }
}
async function init() {
  $('minify').addEventListener('change',()=>{
    if (!$('minify').checked) $('switch_module_path').checked=false;
    $('switch_module_path').disabled=!$('minify').checked;
  });
  $('preview').addEventListener('click',preview);
  $('run').addEventListener('click',()=>start(false));
  $('restore').addEventListener('click',()=>start(true));
  try {
    const result=await api('/api/info');
    token=result.token;
    if(result.error){
      text('runtime-note','ERROR: '+result.error+' Please place this tool in the Apex4X Git repository root.');
      $('run').disabled=true;
      $('preview').disabled=true;
    } else displayPlan(result.plan);
  } catch(err) {
    text('runtime-note','Unable to connect to the local application: '+err.message);
    $('run').disabled=true;
    return;
  }
  await poll();
  window.setInterval(poll,1200);
}
document.addEventListener('DOMContentLoaded',init);
