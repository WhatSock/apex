'use strict';
(() => {
  const el = (id) => document.getElementById(id);
  const form = el('build-form');
  const buildBtn = el('build-btn');
  const previewBtn = el('preview-btn');
  const environment = el('environment');
  const status = el('build-status');
  const log = el('build-log');
  const error = el('build-error');
  const links = el('download-links');
  const fname = el('output-filename');
  const replace = el('replace-stock');
  let busy = false;

  async function api(path, value) {
    const options = value === undefined ? {} : {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    };
    const result = await fetch(path, options);
    const data = await result.json();
    if (!result.ok) throw new Error(data.error || `Request failed (${result.status})`);
    return data;
  }

  function inputs() { return [...document.querySelectorAll('#module-groups input[type="checkbox"]')]; }
  function selected() { return inputs().filter((c) => c.checked).map((c) => c.value); }
  function showCount() {
    const count = selected().length;
    el('selection-count').textContent = `${count} module ${count === 1 ? 'option' : 'options'} selected. The Apex4X core is always included.`;
  }
  function selectionChange() { showCount(); }
  function setSelected(filter) {
    inputs().forEach((input) => { input.checked = filter(input); });
    selectionChange();
  }
  function displayError(msg) {
    error.hidden = false;
    error.textContent = msg;
  }
  function clearError() { error.hidden = true; error.textContent = ''; }
  function args() {
    return { modules: selected(), filename: fname.value.trim(), replaceStock: replace.checked };
  }
  function setBusy(value) {
    busy = value;
    [buildBtn, previewBtn, el('all-btn'), el('widgets-btn'), el('clear-btn'), fname, replace]
      .forEach((c) => { c.disabled = value; });
    inputs().forEach((c) => { c.disabled = value; });
    if (!value) fname.disabled = replace.checked;
    buildBtn.textContent = value ? 'Compiling, please wait...' : 'Compile selected bundle';
  }

  function renderGroups(categories) {
    const container = el('module-groups');
    categories.forEach((cat, idx) => {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = cat.name;
      fieldset.append(legend);
      const options = document.createElement('div');
      options.className = 'choice-grid';
      cat.options.forEach((opt) => {
        const label = document.createElement('label');
        label.className = 'choice';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = opt.id;
        input.dataset.category = String(idx);
        input.addEventListener('change', selectionChange);
        const text = document.createElement('span');
        text.textContent = opt.label;
        label.append(input, text);
        options.append(label);
      });
      fieldset.append(options);
      container.append(fieldset);
    });
    showCount();
  }

  async function showPreview() {
    clearError();
    try {
      const result = await api('/api/plan', args());
      const p = result.plan;
      const list = [
        'Core: 4X/4X.Max.Export.js (always included)',
        `Selected: ${p.requested.join(', ') || 'Core only'}`,
        `Included JavaScript modules (${p.modules.length}): ${p.modules.join(', ') || 'None'}`,
        `Automatically included dependencies: ${p.autoAdded.join(', ') || 'None'}`,
        `Included CSS: ${p.css.join(', ') || 'None'}`,
        `Output: Bundle/${result.outputFilename}`,
      ];
      if (Object.keys(p.aliases).length) {
        list.splice(2, 0, `Shared implementations: ${Object.entries(p.aliases).map(([key, val]) => key + ' → ' + val).join(', ')}`);
      }
      el('preview-text').textContent = list.join('\n');
      status.textContent = 'Selection preview updated. No compilation was performed.';
    } catch (e) {
      displayError(e.message);
    }
  }

  async function waitForJob(id) {
    try {
      const data = await api('/api/status/' + id);
      const nextMessage = data.message || 'Compiling...';
      if (status.textContent !== nextMessage) status.textContent = nextMessage;
      log.textContent = data.log || 'Waiting for compiler output...';
      if (data.state === 'done') {
        el('download-js').href = data.downloads.javascript;
        el('download-zip').href = data.downloads.zip;
        links.hidden = false;
        setBusy(false);
        status.textContent = 'Compilation successful. JavaScript passed its syntax check. Download links are ready below.';
        return;
      }
      if (data.state === 'error') {
        setBusy(false);
        el('log-details').open = true;
        displayError('Compilation failed: ' + data.message);
        status.textContent = 'Compilation failed. See error and log below.';
        return;
      }
      window.setTimeout(() => waitForJob(id), 750);
    } catch (e) {
      setBusy(false);
      displayError('Unable to retrieve compilation progress: ' + e.message);
      status.textContent = 'Progress connection was interrupted. Files may still be compiling on your computer.';
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    clearError();
    links.hidden = true;
    if (replace.checked && !window.confirm('Replace the original Bundle/4X.js after saving a backup? Continue?')) return;
    try {
      // Validate the configuration before starting the build.
      await showPreview();
      if (!error.hidden) return;
      setBusy(true);
      status.textContent = 'Starting local Rollup compilation...';
      log.textContent = 'Preparing source files and compiler dependencies...';
      const data = await api('/api/build', args());
      waitForJob(data.id);
    } catch (e) {
      setBusy(false);
      displayError(e.message);
      status.textContent = 'Compilation could not start.';
    }
  });
  el('preview-btn').addEventListener('click', showPreview);
  el('all-btn').addEventListener('click', () => setSelected(() => true));
  el('widgets-btn').addEventListener('click', () => setSelected((c) => c.dataset.category === '0'));
  el('clear-btn').addEventListener('click', () => setSelected(() => false));
  replace.addEventListener('change', () => { fname.disabled = replace.checked; });

  api('/api/modules').then((data) => {
    renderGroups(data.categories);
    if (data.missingRootFiles.length) {
      environment.classList.add('warn');
      environment.textContent = 'Missing source files: ' + data.missingRootFiles.join(', ') + '. Extract these GUI files into the Apex4X repository root.';
      buildBtn.disabled = true;
    } else {
      environment.textContent = 'Apex4X source tree found. The bundle will be compiled locally. ' + (data.offlineCompilerIncluded ? 'Offline compiler dependencies are included.' : 'Using installed node_modules.');
    }
  }).catch((e) => {
    environment.classList.add('warn');
    environment.textContent = 'Cannot connect to the local builder: ' + e.message;
    buildBtn.disabled = true;
  });
})();
