# ARIA 4X Offline Repository Formatter

Standalone, entirely offline companion for the official WhatSock Apex4X `Format.sh` / `FormatInstall.sh` process.

## One-time setup

1. Extract the download ZIP.
2. Copy `Format4XGUI.py`, `Format4XGUI.bat`, `Format4XGUI.sh`, and the **entire** `FormatterUI` directory into the ROOT of the Apex4X Git checkout. This is where `Format.sh`, `BuildBundle.js`, `rollup.config.js`, `4X/`, `React/`, `Templates/`, etc. live. You may keep the unrelated `BuildBundleGUI` add-on alongside it.
3. Install **Node.js** and **Python 3.10 or later** as normal desktop programs if they are not already installed. Both must be available on PATH. No Node package installation is needed.
4. On Windows, double-click **`Format4XGUI.bat`**. It starts a small localhost server and opens `http://127.0.0.1:8767/` in your default browser. If no browser appears, paste that address manually.
5. Four options are selected by default. Click **Run selected operations** to perform the original full sequence. Or deselect a phase and use Preview operations to check the file count.
6. Wait for **Completed successfully** before closing the command window. Download the report if desired. Stop the server using Ctrl+C in that window.

**Requires no NPM, npx, `npm install`, `npm audit fix`, `FormatInstall.sh`, global Prettier install, or internet connection**. Formatting packages are already in `FormatterUI/offline-dependencies.zip`. Initial launch extracts those dependencies automatically into `FormatterUI/.cache/node_modules/`.

## Exactly what the tool does

- Reads the original `Format.sh` commands as a reference. It **does not execute the shell file** or the online-install commands.
- Formats exactly the same groups of HTML, CSS, JavaScript, and JSON source files using bundled Prettier **3.9.10**. Files are matched recursively where indicated by the original glob patterns. (If a repository file cannot be parsed, the run fails safely rather than continuing and committing a partial update.)
- Executes the **63 original UglifyJS 3.19.3 minification operations** against the core, dynamic modules, and standard modules, using the same `--comments --compress --mangle` arguments as `Format.sh`.
- Runs the original `BuildBundle.js` and `rollup.config.js` with bundled patched Rollup **2.80.0**, using its already-packaged plugins. Output is `Bundle/4X.js`. Does not run the original `BuildBundle.sh` internet update step.
- Applies the same replacement specified by the official `Templates/_common/_doc_files/Save4X.py`: in generated `4X/4X.js`, `moduleFolder:"/4X/Modules/"` changes to `moduleFolder:"/4X/Min/"`.
- Performs JavaScript syntax checks on all generated/minified output with `node --check` before committing changes.

### Safety and backups

All formatting and building happen first in a **temporary staging directory** inside `FormatterUI/.cache/jobs/`, not directly in the repository's source files. If a preparation stage or syntax check fails, no source/output file is modified. On success, the tool backs up every file that would change to `FormatterUI/backups/<timestamp>/original/...`, writes a `manifest.json` recording hashes, then atomically replaces those files. A failure during the commit triggers rollback.

The button **Restore last successful run** reverses the last *completed* formatting run, but only when none of its outputs have changed since formatting. If you have edited the output afterward, restoration refuses to overwrite your newer changes. You can also restore directly from Git if your repo is under source control.

Execution reports are in `FormatterUI/reports/`, and can be downloaded through the interface. `FormatterUI/.gitignore` excludes the local cache, backups, and reports from Git; do not remove it if you plan to commit the formatter to your repository. The original `Format.sh`, `FormatInstall.sh`, `BuildBundle.sh`, `BuildBundle.js`, and `rollup.config.js` are not rewritten by the utility (except formatting `rollup.config.js` if you select the Prettier phase, matching the original `Format.sh`).

**Original scripts are retained unchanged.** Source formatting legitimately changes files such as `4X/4X.Max.js` and `rollup.config.js` when selected; backups are kept.

## JAWS / keyboard accessibility

The UI uses native labeled checkboxes, `fieldset` and `legend`, ordinary buttons, headings and a polite live status announcement. Tab moves among controls, Space toggles a checkbox, and Enter activates buttons. The execution log is in a collapsible Details section and can be navigated as text. Keyboard and JAWS testing on your own Windows system is recommended; browser/JAWS interactions were not certified here.

## Optional command-line usage

In Command Prompt, from the Apex4X repository root:

```bat
python Format4XGUI.py --preview
python Format4XGUI.py --run
python Format4XGUI.py --run --skip-bundle
python Format4XGUI.py --restore-last
python Format4XGUI.py --no-browser --port 8888
```

Only select `--skip-minify` if you also add `--skip-module-path` (the core module path is changed in the minified output).

For macOS or Linux: `sh ./Format4XGUI.sh`, or `python3 Format4XGUI.py`.

## Validation and limitations

- The full test on the official 2023.8.1-2.47 archive (Neuromancer 2024.7.15) successfully processed 416 Prettier inputs, ran all 63 minification operations, compiled the bundle with Rollup 2.80.0, switched the module folder and syntax-checked 64 output scripts. It changed 135 files and successfully restored them from backup. This verifies build mechanics and rollback on the test repository.
- It has not been interactively certified in a graphical browser or using JAWS, and the compiled widgets require separate real-browser/assistive technology testing for functional accessibility.
- Future Apex4X source changes can add incompatible syntax or new CLI arguments; the program refuses unknown UglifyJS operations and reports errors rather than guessing.
- This tool itself does not update your GitHub `package-lock.json` or any other security alerts. Rollup is 2.80.0 **inside this tool**.

## Troubleshooting

**Python not found:** Install Python 3.10+ and use the Python launcher `py -3` or ensure python is on PATH. 

**Node.js not found:** Install Node.js (not NPM packages); `node --version` should work in Command Prompt.

**Port already occupied:** Run `python Format4XGUI.py --port 8888`.

**No internet:** This is expected to work completely offline. If an error mentions missing modules, delete only `FormatterUI/.cache/` and run again; it will re-extract the bundled packages.

**Build or formatting error:** Download the report or inspect `FormatterUI/reports/` and check stderr in the log. The repository files are unchanged on preparation failure.

**Performance:** First run unpacks 3,300+ Node package files. A full format/build took about 30 seconds in the test environment but can be slower on other PCs.
