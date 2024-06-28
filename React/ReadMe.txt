
Apex 4X can be imported into any React project as a bundle and used to render dynamic ARIA widgets.

Directions

1. Using Git Cmd or Git Bash, navigate to the root of your React project.

2. Enter "npm install apex4x" to install 4X.

3. At the top of your React JS component file, include: `import 'apex4x';`

4. Use window.$A to render any desired widget type. For syntax and config examples, view the folder: `Help/Module Imports/Widgets`

Examples

The src folder includes some basic examples that can be copied into a test React project. The concepts are simple and easy to expand upon.

There are 2 4X widget components, ExampleButton.js and ExamplePopup.js, both of which can be modified when rendered to allow for flexible usage scenarios. (View App.js for details.)

Both the Button and Popup components can be customized individually by passing props to each. The same concept can be applied to all of the widget modules within 4X.
