# Apex 4X
The Comprehensive ARIA Development Suite (Current version: Virtual Light - 2021.1.6)

## Contents
+ [Introduction](#introduction)
+ [Widget Templates](#templates)
+ [4X APIs](#apis)
+ [Usage](#usage)
+ [Modules](#modules)
+ [ModuleUsage](#moduleusage)
+ [Importing Modules](#importing)
+ [Alternative Import Methods](#alternativeimports)
+ [Creating Modules](#creatingmodules)
+ [ReactJS Disambiguation](#reactjs)
+ [License](#license)
+ [Acknowledgements](#acknowledgements)
+ [Project Home](#homepage)
+ [Related Projects](#related)
+ [Change Log](#changelog)

<!----><a name="introduction" tabindex="-1"></a>
## Introduction

Apex 4X is a comprehensive ARIA development suite, including a core collection of powerful ARIA development utilities and functions, plus a full index of scalable ARIA design pattern templates. It also includes two APIs that are specifically designed to enhance and facilitate advanced ARIA development.

ARIA stands for Accessible Rich Internet Applications, and is a technical specification published by the World Wide Web Consortium (W3C) Web Accessibility Initiative (WAI). The purpose, to map simulated web controls to equivalent control types on the platform Accessibility API, and to provide various mechanisms to enhance the accessibility of web technologies for people with disabilities.

Apex 4X provides a comprehensive suite of ARIA related processes to make developing accessible technologies easier and more reliable and does not expose the accessibility layer where it can be casually changed by those who do not understand it. This makes it possible for developers who have no prior background in accessible development, to create and implement accessible web technologies for people with disabilities regardless.

Release article: https://www.linkedin.com/pulse/released-apex-4x-comprehensive-aria-development-suite-bryan-garaventa

<!----><a name="templates" tabindex="-1"></a>
## Widget Templates

All of the following ARIA widget templates are available for immediate use. None of them require any prior knowledge of ARIA to implement.

Accordions, Buttons, Carousels, Checkboxes, Comboboxes, Datepickers, Dialogs, Drag and Drop, Footnotes, Grids, Listboxes, Menus, Popups, Radios, Sliders, Switches, Tabs, Tooltips, and Trees.

<!----><a name="apis" tabindex="-1"></a>
## 4X APIs

The $A API provides all core functionality, including dynamic modularization for swappable components, advanced ARIA development features and processes, data management, DOM related methods and processes, dynamic import methods, visual effect methods for content display and animation, and chaining.

The DC (Dynamic Component) API provides  direct access to individually configurable components and widgets. Each DC instance includes the ability to control dynamic behaviors, manage content and events, utilize lifecycle methods, pass custom props between other DC instances and external resources, control rendering processes, plus manage visual effects and animation.

<!----><a name="usage" tabindex="-1"></a>
## Usage

* Place the 4X folder at the root of your website directory. The 4X folder should then be accessible from "www.YourDomain.com/4X".
* Add the following script statement within the head of your page: `<script type="text/javascript" src="/4X/4X.js"></script>`

After which, all of the $A API features will be available, including the full suite of ARIA development processes. These are fully documented within the help docs folder at: "Help/ARIA Development"

The default server location can be changed by modifying the "moduleFolder" property within 4X.js as needed.

In contrast, the DC API is only applicable when creating DC instances for the configuring of dynamic components.

Any DOM element or markup string can be turned into a DC object using the following syntax:

```
var DC = $A.toDC(domElement, {
  // Optional DC API properties and methods here.
});
```

Or even the following:

```
// Fetch an external control and convert it into a DC object to render with behavior declarations.
var DC = $A.toDC("path/resource.php?params#ExternalElementId", {
  root: 'body',
  append: true,
  forceFocus: true,
  afterRender: function(DC) {
    // Do something.
  }
});
```

After which, all DC API properties and methods will be available for that object.

For help regarding this, view the documentation at: 
"Help/$A API/DC Objects/", and 
"Help/DC API".

<!----><a name="modules" tabindex="-1"></a>
## Modules

Dynamic modularization is one of the most powerful features that 4X provides, including on-demand imports, internal caching for shared modules, automatic queuing for sequential imports, shared props between modules within the same import scope, and optional deferment.

This makes it possible to dynamically import functionality modules on an as-needed basis, and to chain required dependencies that are shared between multiple modules, without having to preload all related script files in advance when the page first loads. Internal caching maximizes overall processing speed, and callback functions can be optionally deferred so they will only execute after the page completes loading.

Custom props can also be passed from the originating import statement into all chained external modules, which are fully sandboxed within each module instance to ensure that no conflicts can occur, even when passing different props to the same module within differing import statements.

<!----><a name="moduleusage" tabindex="-1"></a>
### Module Usage

By default, the 4X module folder is located at "/4X/Modules/", which is why the 4X folder needs to be placed at the root of the website directory. However, this can be changed if a different location is necessary.

If the 4X folder needs to be place somewhere else, such as at "/Subfolder/Path/4X", then it will be necessary to change the internal "moduleFolder" property in 4X.js to reference the correct module folder. E.G. Change it to "/Subfolder/Path/4X/Modules/".

This will allow 4X to dynamically import required modules as needed to ensure proper functionality.

As another option, all of the modules provided within this archive have been minified to maximize responsiveness and reduce load times as much as possible. All of these are located within the folder "4X/Min/". To automatically utilize these enhancements, simply reference the "Min" folder within the moduleFolder property instead of the "Modules" folder.

Example: `moduleFolder: "/4X/Min/"`

<!----><a name="importing" tabindex="-1"></a>
### Importing Modules

All modules used by 4X should be added to the "4X/Modules/" folder. This allows any module saved in this location to be imported using its file name alone. When importing a JS file, it is not necessary to add the .js extension. However, when importing a CSS file, the extension is needed to differentiate implicit JS files from explicit CSS files.

To better understand dynamic importing, view the help documentation at: "/Help/$A API/Import and Fetch APIs/Import.txt".

<!----><a name="alternativeimports" tabindex="-1"></a>
### Alternative Import Methods

It is also possible to import any number of modules using the website script tag using the src attribute.

Modules can be declared for importing by appending a hash symbol ("#") to the 4X.js file path, followed by the module name to import. Multiple modules can be imported by separating each with a comma (",").

This technique supports the "async" script loading feature to maximize page loading speeds.

```
<script async type="text/javascript" src="/4X/4X.js#ModuleName1,ModuleName2,Etc"></script>
```

<!----><a name="creatingmodules" tabindex="-1"></a>
### Creating Modules

There is no required syntax for creating a standalone module. Any properly coded JavaScript file can become a module import as-needed using the $A.import() statement.

However, when creating modules that reference additional module imports, it is important to use the Module Import Template to do so. This is available in the file at: "Help/ModuleTemplate.js"

For example, the props object is required to be passed down to all imported modules to ensure that deferred callbacks can be queued correctly when chained together. This is a powerful feature, and allows for shared props to be passed between external modules when loaded dynamically for custom behavior configurations.

For more information regarding props, view the help file at: "Help/$A API/Import and Fetch APIs/Props"

<!----><a name="reactjs" tabindex="-1"></a>
## ReactJS Disambiguation

Those familiar with React development will notice certain concept and keyword similarities within 4X. This was done deliberately to make it possible for developers to instantly understand the concept of what property or feature is being referenced, especially when the keyword or concept has a direct intuitive meaning that can be easily understood by itself. There are also some unintentional similarities as well. It is important to note, however, that 4X is not a ReactJS project, and has no external dependencies.

One similarity is the use of the "root" property name for identifying the target insertion point for dynamic components when rendered.

Another is the reference to lifecycle methods. Other than the loose concept of this functionality within the DC API documentation, there is no reuse of any ReactJS lifecycle method names within 4X.

Additionally, the term "import" is used within ReactJS to reference and pull in native React components. 4X, in contrast, uses the term "import" to reference the browser Fetch API for importing external module files on an as-needed basis for conditional processing. The concept is similar, but different.

Last is the concept of passing "props" between components. In this case, "props" is simply shorthand for properties. Within React, props are passed between native React component objects. Within 4X, in contrast, props are passed between external module components when dynamically imported using the browser Fetch API. Conceptually the two are similar, but also different.

To summarize, 4X is not a ReactJS project, nor does it include any code from ReactJS. There is no 4X version at this time that can be imported directly into the ReactJS IDE in the same manner as other native React components. I hope to add this as time permits, but I can't predict when.

Regarding other JavaScript libraries and frameworks, 4X is sandboxed within its own namespace, and should have no difficulties running alongside any other library or framework, as long as these resources are not programmed to control the same elements in similar ways when executed.

<!----><a name="license" tabindex="-1"></a>
## License

Apex 4X including all template design patterns is distributed under the terms of the Open Source Initiative OSI - MIT License, and may be freely used for any purpose within any web technology.

<!----><a name="acknowledgements" tabindex="-1"></a>
## Acknowledgements

* Author and developer: Bryan Garaventa https://www.linkedin.com/in/bgaraventa
* Website designer: Angela Ricci http://gericci.me
* Style and markup editor: Laurence Lewis https://www.linkedin.com/in/laurence-lewis-77520365/  
* Code contributor: Danny Allen http://dannya.com

<!----><a name="homepage" tabindex="-1"></a>
## Project home

http://whatsock.com

<!----><a name="related" tabindex="-1"></a>
## Related projects

https://github.com/whatsock

<!----><a name="changelog" tabindex="-1"></a>
## Change log:

2021.1.6 (Virtual Light): Added $A.nearestHeadingLevel() and DC.nearestHeadingLevel() as an ARIA support function that will return the level number of the nearest heading. View Help/ARIA Development/NearestHeadingLevel for support.

2021.1.5 (Broken Angels): Reconfigured internal event handling object locale to better accomidate external testing frameworks.

2021.1.4 (Mona Lisa Overdrive): Added CSS offset aliases for width, height, top, and left for shorthand computation of common element rendering properties.

2021.1.3 (Snow Crash): Added all available touch events as DC overrides, and fixed a small bug in the Get() method to prevent null reference errors at runtime.

2021.1.2 (Altered Carbon): Fixed the expected behavior for toggled DC objects within 4X.

2021.1.1 (Burning Chrome): Initial public release.
