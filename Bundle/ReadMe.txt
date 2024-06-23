To recompile a new bundled 4X build and customize the module imports that are included, edit the file `BuildBundle.js` then run the build script `BuildBundle.sh`.

By default, all Apex 4X modules are included in the bundled 4X build. Activate WebserverRun.sh in the project root folder to test within the 4X landing page.

4X.js can be manually included using a standard script tag, or imported as part of a module. The index.htm page in the root folder imports the bundled 4X.js as a JavaScript module. View index.js for import usage examples.
