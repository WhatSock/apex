
Apex 4X can be imported into any React project as a bundle and used to render dynamic ARIA widgets.

Option 1: Automatic

Run the script "CreateTestReactProject.sh" to automatically build a test React project for loading the 4X widget components.

Option 2: Manual

1. Using Git Cmd or Git Bash, navigate to the root of your React project.

2. Enter "npm install apex4x" to install 4X.

3. At the top of your React JS component file, include: `import 'apex4x';`

4. Use window.$A to render any desired widget type. For syntax and config examples, view the folder: `Help/Module Imports/Widgets`

Example Components

The src/4X folder includes basic examples that can be copied into any React project. The concepts are simple and easy to expand upon. (View App.js for details.)

All 4X widget components can be customized individually by passing props to each. The same concept can be applied to all the widget modules within 4X.
