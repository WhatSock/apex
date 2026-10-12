# ARIA 4X: Offline Apex4X Bundle Builder

This is a **standalone local web interface** for the existing WhatSock Apex4X compilation process, created for placement in the Apex4X repository root. It uses the repository's authentic `BuildBundle.js` module list and dependency documentation, the original `rollup.config.js`, and the same Apex4X standard module files. It does not change the original source code.

## Contents and prerequisites

**Files to add to the repository root:**

```text
Apex4X-repository-root/
  BuildBundle.js              # existing: unchanged
  rollup.config.js            # existing: unchanged
  package.json                # existing: unchanged
  4X/                        # existing: unchanged
  Bundle/                    # existing: unchanged except for generated JS
  BuildBundleGUI.py          # new Python local server / build runner
  BuildBundleGUI.bat         # new Windows launcher
  BuildBundleGUI.sh          # new macOS/Linux/Git Bash launcher
  BundleBuilderUI/           # new offline interface and compiler package
    index.html
    style.css
    app.js
    compiler-dependencies.zip
    .gitignore
    README.md
    tests/
    .cache/                  # generated on first run, ignored by Git
    output/                  # compiled downloadable ZIPs, ignored by Git
```

- Python 3.10 or newer (standard library only, no Python packages to install).
- Node.js installed on the computer and accessible on `PATH` (tested with Node.js 22).
- The complete Apex4X source tree and `Help/Module Dependency Index.txt` in the same repository.
- A browser capable of loading `http://127.0.0.1`.

The ZIP includes **an offline archive of installed Rollup build dependencies**, previously extracted from the Apex4X source environment provided by the publisher. The builder prefers an existing `node_modules/` in the repository; if absent, it checks the included archive's SHA-256 and extracts it under `BundleBuilderUI/.cache/node_modules/` on first build. This may take a few seconds. Package license files are preserved. It will **not** run `npm install`, `npx`, `update-browserslist-db@latest`, or any network request.

> A message from Browserslist saying its locally stored database is outdated is not a build failure and is not a reason for the builder to fetch updates. Updating dependencies is a separate, explicitly online maintenance action.

## Start on Windows (including JAWS)

1. Put all contents of this ZIP alongside the original `BuildBundle.js` and `rollup.config.js` (not inside `4X`, `Bundle`, or `node_modules`).
2. Double-click **`BuildBundleGUI.bat`**. It checks that Node.js and Python are installed, then starts the local server and opens your default browser.
3. If the browser does not appear, open `http://127.0.0.1:8766/` manually.
4. Navigate through the **fieldset legends**, **checkbox labels**, **Compile** and **Preview** controls using Tab and Shift+Tab. Press Space to toggle checkboxes; Enter activates a focused button.
5. Screen-reader status messages report the outcome of compilation. Expand **Compiler output and validation log** for detailed diagnostics; the log is keyboard-scrollable.
6. After a successful compilation, use **Download compiled JavaScript** or **Download complete bundle ZIP**.
7. Press Ctrl+C in the console window to close the local server. It is not running as a background service.

### macOS / Linux / Git Bash

Run `sh ./BuildBundleGUI.sh` from the repo root (or `python3 BuildBundleGUI.py`).

### Launch options

```text
python BuildBundleGUI.py --no-browser
python BuildBundleGUI.py --port 8888
python BuildBundleGUI.py --port 0          # dynamically choose a free port
```

If port 8766 is occupied, use a different port. The server always binds only to `127.0.0.1` (loopback); it is **not** hosted on the public internet and does not need network connectivity.

## The module selector

- **Core**: `4X/4X.Max.Export.js` is always included.
- **Accessible widgets**: a checkbox for each of the 19 original widget families.
- **Utilities**: dependency modules, including `AccName`, `Velocity`, `SmoothScroll`, etc.
- **Straylight**: includes the complete original module suite.
- **Checkbox, Radio and Switch**: these accessible widgets use the framework's shared `Button.js` implementation; selecting any of them resolves to `Button.js` and its dependencies.
- **Carousel and Drag**: their required TinySlider and Dragula CSS is included and embedded by the original PostCSS configuration.
- **Select all modules**: produces the full original module import list, including Straylight.
- **Select all widgets**: selects the 19 widget choices but not Straylight (supporting utilities are resolved as needed).
- **Clear choices**: creates a core-only bundle.
- **Preview included modules**: lists source module imports, automatically added dependencies, and CSS before compilation.

The dependency rules and canonical import order are transcribed from the repository's original `Help/Module Dependency Index.txt` and `BuildBundle.js`. They are restricted to the modules known to this Apex4X release. If you later add a module or modify its dependency graph, update the Python catalog or use the original build scripts for the new version until this tool is updated.

## The compile process and output

The builder invokes the **original `rollup.config.js`** using the locally installed `rollup` executable via Node.js. With the archived dependencies, a byte-for-byte copy of that config is placed beside the cached Node packages so module resolution works without installing packages into the repo. Rollup's input/output options are overridden to use a temporary, generated import list and a temporary compiled output file.

The only generated source is the temporary import list. The following **existing repository files are never modified**:

- `BuildBundle.js`
- `BuildBundle.sh`
- `rollup.config.js`
- `package.json`
- Any files inside `4X/`

**Default output** is `Bundle/4X.Custom.js`, which does not replace the original stock `Bundle/4X.js`. You can choose another simple `.js` filename. If a previously generated file already uses that name, a timestamped backup is created.

**To replace the stock bundle**, check *Replace Bundle/4X.js*. The application asks for confirmation and copies the original stock bundle to a timestamped `Bundle/4X.js.backup-...` file before publishing the new compiled output.

Successful builds produce:

- `Bundle/<selected-filename>.js` in the existing repo;
- `BundleBuilderUI/output/ARIA4X-bundle-<build-id>.zip`, also available from the browser;
- Inside the ZIP: `Bundle/<filename>`, reproducible generated entry imports, `build-manifest.json` with source/config hashes and module details, README and the original repository license (if present).

Compilation is considered successful only if the existing Rollup compiler returns successfully, an output JS file exists, `node --check` passes, and the resulting ZIP passes integrity checking. A Rollup compile/syntax pass **does not** establish that the widget works correctly in browsers or with JAWS. Use the official WhatSock demos and real assistive technology for final QA.

## Security and privacy

- The server listens on `127.0.0.1` only and validates `Host` and POST `Origin` headers.
- No downloads or online dependency updates are invoked, and there is no telemetry.
- The module list and output filename are strictly validated; the browser cannot supply arbitrary shell commands, paths, or scripts.
- Only the three UI files, module catalog, job statuses, and completed downloads are exposed via HTTP.
- Local ZIP dependencies are checksum verified before extraction; extracted compiler files remain local and are excluded from Git by `.gitignore`.
- Do **not** deploy the Python server or `BundleBuilderUI/` to a public website. This is a local development utility.

## Troubleshooting

**'Missing source files'**: You likely placed the files in a nested folder instead of the repository root. Move `BuildBundleGUI.py` beside `BuildBundle.js` and `rollup.config.js`.

**'Node.js cannot be found'**: Install Node.js and reopen the command prompt so `node` is available on PATH. Python alone cannot compile Rollup.

**'Port already in use'**: Run `python BuildBundleGUI.py --port 8888`.

**Browserslist asks to update**: The database is bundled locally; leave it as is for fully offline compilation. This is a warning, not a command executed by the builder.

**'Rollup failed'**: Open the compiler log. Check the original `rollup.config.js`, `4X/Standard/Modules` directory, original imports, file permissions and Node.js version. The builder does not modify the input files, and the original compiled bundle remains intact if compilation fails.

**Missing ZIP download**: The local page may have been reloaded after building; ZIPs remain at `BundleBuilderUI/output/` until you remove them.

**Security software blocks localhost**: Allow Chrome/Edge/Firefox to visit `http://127.0.0.1:8766/`. The app does not connect to whatsock.com or the internet.

## Tests

Run source-logic/API tests from the Apex4X repository root:

```sh
python -m unittest discover -s BundleBuilderUI/tests -v
```

Check actual compilation by selecting one or more modules and clicking Compile. The build ZIP records the selected modules and exact source version.

**Testing status for this release:** Compiled core-only, a four-widget build, a CSS-dependent Carousel/Drag build, the full Straylight build, and safe stock-bundle replacement against the publisher's `2023.8.1-2.47` source. Rollup finished successfully, compiled output passed `node --check`, and ZIP CRC validation passed. Browser/JAWS widget interactions were not certified.
