# Apex 4X : The Comprehensive ARIA Development Suite
(Version: Iron Sunrise - 2023.7.27)

"Art should comfort the disturbed and disturb the comfortable.", Banksy

NEW: Apex 4X can now be installed into any project using the NPM statement: `npm install apex4x`

## Contents
+ [Introduction](#introduction)
+ [Accessible Widget Templates](#templates)
+ [Quick Start Guide](#quickstart)
+ [Using Dynamic Module Imports](#dynamicimports)
+ [Using Standard Script Tags](#standardscripttags)
+ [ReactJS Disambiguation](#reactjs)
+ [License](#license)
+ [Acknowledgements](#acknowledgements)
+ [Related Projects](#related)
+ [Change Log](#changelog)

<!----><a name="introduction" tabindex="-1"></a>
## Introduction

Apex 4X is a comprehensive ARIA development suite, including a core collection of powerful ARIA development utilities and functions, plus a full index of scalable ARIA design pattern templates. It also includes two APIs that are specifically designed to enhance and facilitate advanced ARIA development.

ARIA stands for Accessible Rich Internet Applications, and is a technical specification published by the World Wide Web Consortium (W3C) Web Accessibility Initiative (WAI). The purpose, to map simulated web controls to equivalent control types on the platform Accessibility API, and to provide various mechanisms to enhance the accessibility of web technologies for people with disabilities.

Apex 4X provides a comprehensive suite of ARIA related processes to make developing accessible technologies easier and more reliable and does not expose the accessibility layer where it can be casually changed by those who do not understand it. This makes it possible for developers who have no prior background in accessible development, to create and implement accessible web technologies for people with disabilities regardless.

To learn more and see a live demonstration, [view the Beginner Tutorial](https://whatsock.com/Tutorials/Beginner-Introduction.htm).

Homepage: https://whatsock.com

<!----><a name="templates" tabindex="-1"></a>
## Accessible Widget Templates

All of the following ARIA widget templates are available for immediate use. None of them require any prior knowledge of ARIA to implement.

Accordions, Buttons, Carousels, Checkboxes, Comboboxes, Datepickers, Dialogs, Drag and Drop, Footnotes, Grids, Listboxes, Menus, Popups, Radios, Sliders, Switches, Tabs, Tooltips, and Trees.

Live demos: https://whatsock.com/Templates

<!----><a name="quickstart" tabindex="-1"></a>
## Quick Start Guide

Everything that is needed for 4X to run properly is included within the "4X" folder. This can be copied into any other project to begin using it.

* The primary script files, "4X.js" and "4X.Max.js" comprise all the core functionality of Apex 4X.
* The module files within the folders "4X/Min" and "4X/Modules" are meant to be used with dynamic imports.
* The module files within the "4X/Standard" folder, in contrast, are meant to be used with standard script tags.

There are two ways to implement 4X and its accompanying modules, using dynamic module imports, or using a standard script tag for each module as desired.

<!----><a name="dynamicimports" tabindex="-1"></a>
### Using Dynamic Module Imports

The value of importing modules dynamically is that there is no need to hardcode script tags within each webpage. Instead, the requisit modules are loaded dynamically as-needed, which is faster and more responsive when running complex web apps.

However, doing so requires some configuration. There is only one setting that needs to be set for 4X to run properly.

1. Within the 4X folder, open the 4X.max.js file within a text editor, and search for "moduleFolder". The same thing will need to be done for the file 4X.js.
2. Make sure that the folder path specified there points to the desired module folder within the 4X directory, including the "/" character at the end. This property needs to reflect the correct relative folder structure when loaded on a webserver.
3. Load 4X into your project using a standard script statement as shown within the template folders.

Since 4X uses Fetch protocols to import modules when needed, it must be run from a webserver. For testing and development, this can be easily set up locally by doing the following.

1. Install NodeJS from: https://nodejs.org/en/download/
2. Run the setup file named "WebserverInstall.sh" to install the local webserver within this project. This need only be done once.
3. Run the file "WebserverRun.sh" to start the webserver and open the index.htm file at the project root.
4. Within the opened browser, follow the Templates link to browse the available module templates and run them locally for testing and modification.

<!----><a name="standardscripttags" tabindex="-1"></a>
### Using Standard Script Tags

For those wishing to load 4X using the standard script tag instead of using dynamic module imports, the following order should be observed to ensure that all module dependencies are loaded correctly.

Simply copy and paste the below list into the head tag of your webpage, 
delete the module scripts that you don't wish to use,
and change the href and src attribute paths to point to the correct modules within the 4X/Standard folder.
Then a simple setup script can be loaded to configure all desired functionality.

Note: For testing purposes, all of the below declarations have been added to the index.htm file at the root of this archive.

```
    <link rel="stylesheet" type="text/css" href="4X/Standard/Modules/Dragula.css">
    <link rel="stylesheet" type="text/css" href="4X/Standard/Modules/TinySlider.css">

    <script  src="4X/4X.js"></script>

    <script  src="4X/Standard/Modules/CurrentDevice.js"></script>
    <script  src="4X/Standard/Modules/Dragdealer.js"></script>
    <script  src="4X/Standard/Modules/Dragula.js"></script>
    <script  src="4X/Standard/Modules/TinySlider.js"></script>
    <script  src="4X/Standard/Modules/Velocity.js"></script>
    <script  src="4X/Standard/Modules/VelocityUI.js"></script>

    <script  src="4X/Standard/Modules/AccName.js"></script>
    <script  src="4X/Standard/Modules/Animate.js"></script>
    <script  src="4X/Standard/Modules/RovingTabIndex.js"></script>
    <script  src="4X/Standard/Modules/SmoothScroll.js"></script>

    <script  src="4X/Standard/Modules/Accordion.js"></script>
    <script  src="4X/Standard/Modules/Beep.js"></script>
    <script  src="4X/Standard/Modules/Button.js"></script>
    <script  src="4X/Standard/Modules/Carousel.js"></script>
    <script  src="4X/Standard/Modules/Combobox.js"></script>
    <script  src="4X/Standard/Modules/Datepicker.js"></script>
    <script  src="4X/Standard/Modules/Dialog.js"></script>
    <script  src="4X/Standard/Modules/Drag.js"></script>
    <script  src="4X/Standard/Modules/Footnote.js"></script>
    <script  src="4X/Standard/Modules/Grid.js"></script>
    <script  src="4X/Standard/Modules/Listbox.js"></script>
    <script  src="4X/Standard/Modules/Menu.js"></script>
    <script  src="4X/Standard/Modules/Popup.js"></script>
    <script  src="4X/Standard/Modules/Slider.js"></script>
    <script  src="4X/Standard/Modules/Tab.js"></script>
    <script  src="4X/Standard/Modules/Tooltip.js"></script>
    <script  src="4X/Standard/Modules/Tree.js"></script>

    <script  src="4X/Standard/Modules/Straylight.js"></script>
```

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
* Website designer: Angela Ricci https://gericci.me
* Style and markup editor: Laurence Lewis https://www.linkedin.com/in/laurence-lewis-77520365/  
* Code contributor: Danny Allen https://dannya.com

<!----><a name="related" tabindex="-1"></a>
## Related projects

https://github.com/whatsock

<!----><a name="changelog" tabindex="-1"></a>
## Change log:

2023.7.27 (Iron Sunrise): Updated the DC lifecycle process within core 4X to automatically detect when a Velocity animation is running so that it can be properly reversed when autoCloseSameWidget is true. Updated modules: Datepicker, Menu, Straylight.

2023.7.14 (Blade Runner): Added the global $A.isAnimating flag to identify when a Velocity animation is currently running, plus the DC.isAnimating flag to indicate when a specific DC object is running an animation.

2022.8.14 (Diamond Age): Bug fix: Corrected the autoCloseSameWidget prop functionality to handle nested widget types like nested menus.

2022.2.18 (Diamond Age): Added the ability to use $A.updateDisabled() with no arguments to map all disabled elements on the page that include aria-disabled="true". Fixed the registered DC object tracker to better handle when multiple DC objects are bound to the same triggering element.

2021.1.6 (Virtual Light): Added $A.nearestHeadingLevel() and DC.nearestHeadingLevel() as an ARIA support function that will return the level number of the nearest heading. View Help/ARIA Development/NearestHeadingLevel for support.

2021.1.5 (Broken Angels): Reconfigured internal event handling object locale to better accomidate external testing frameworks.

2021.1.4 (Mona Lisa Overdrive): Added CSS offset aliases for width, height, top, and left for shorthand computation of common element rendering properties.

2021.1.3 (Snow Crash): Added all available touch events as DC overrides, and fixed a small bug in the Get() method to prevent null reference errors at runtime.

2021.1.2 (Altered Carbon): Fixed the expected behavior for toggled DC objects within 4X.

2021.1.1 (Burning Chrome): Initial public release.
