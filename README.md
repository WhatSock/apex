# apex
Apex 4X: The Comprehensive ARIA Development Suite

Apex 4X
===

Apex 4X is a comprehensive ARIA development suite, including a core collection of powerful ARIA development utilities and functions, plus a full index of scalable ARIA design pattern templates. It also includes two APIs that are specifically designed to enhance and facilitate advanced ARIA development.

The $A API provides all core functionality, including dynamic modularization for swappable components, advanced ARIA development features and processes, data management, DOM related methods and processes, dynamic import methods, visual effect methods for content display and animation, and chaining.

The DC (Dynamic Component) API provides  direct access to individually configurable components and widgets. Each DC instance includes the ability to control dynamic behaviors, manage content and events, utilize lifecycle methods, pass custom props between other DC instances and external resources, control rendering processes, plus manage visual effects and animation.

Usage
-----

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

After which, all DC API properties and methods will be available for that object.

For help regarding this, view the documentation at: 
"Help/$A API/DC Objects/", and 
"Help/DC API".

Modules
-----

Dynamic modularization is one of the most powerful features that 4X provides, including on-demand imports, internal caching for shared modules, automatic queuing for sequential imports, shared props between modules within the same import scope, and optional deferment.

This makes it possible to dynamically import functionality modules on an as-needed basis, and to chain required dependencies that are shared between multiple modules, without having to preload all related script files in advance when the page first loads. Internal caching maximizes overall processing speed, and callback functions can be optionally deferred so they will only execute after the page completes loading.

Custom props can also be passed from the originating import statement into all chained external modules, which are fully sandboxed within each module instance to ensure that no conflicts can occur, even when passing different props to the same module within differing import statements.

Module Usage
-----

By default, the 4X module folder is located at "/4X/Modules/", which is why the 4X folder needs to be placed at the root of the website directory. However, this can be changed if a different location is necessary.

If the 4X folder needs to be place somewhere else, such as at "/Subfolder/Path/4X", then it will be necessary to change the internal "moduleFolder" property in 4X.js to reference the correct module folder. E.G. Change it to "/Subfolder/Path/4X/Modules/".

This will allow 4X to dynamically import required modules as needed to ensure proper functionality.

Importing Modules
-----

All modules used by 4X should be added to the "4X/Modules/" folder. This allows any module saved in this location to be imported using its file name alone. When importing a JS file, it is not necessary to add the .js extension. However, when importing a CSS file, the extension is needed to differentiate implicit JS files from explicit CSS files.

To better understand dynamic importing, view the help documentation at: "/Help/$A API/Import and Fetch APIs/Import.txt".

Alternative Import Methods
-----

It is also possible to import any number of modules using the website script tag using the src attribute.

Modules can be declared for importing by appending a hash symbol ("#") to the 4X.js file path, followed by the module name to import. Multiple modules can be imported by separating each with a comma (",").

This technique supports the "async" script loading feature to maximize page loading speeds.

```
<script async type="text/javascript" src="/4X/4X.js#ModuleName1,ModuleName2,Etc"></script>
```

Creating Modules
-----

There is no required syntax for creating a standalone module. Any properly coded JavaScript file can become a module import as-needed using the $A.import() statement.

However, when creating modules that reference additional module imports, it is important to use the Module Import Template to do so. This is available in the file at: "Help/ModuleTemplate.js"

For example, the props object is required to be passed down to all imported modules to ensure that deferred callbacks can be queued correctly when chained together. This is a powerful feature, and allows for shared props to be passed between external modules when loaded dynamically for custom behavior configurations.

For more information regarding props, view the help file at: "Help/$A API/Import and Fetch APIs/Props"

Widget Templates
-----

All of the following ARIA widget templates are available for immediate use. None of them require any prior knowledge of ARIA to implement.

Accordions, Buttons, Checkboxes, Comboboxes, Datepickers, Dialogs, Footnotes, Listboxes, Menus, Popups, Radios, Switches, Tabs, Tooltips, and Trees.

License
-----

Apex 4X including all template design patterns is distributed under the terms of the Open Source Initiative OSI - MIT License, and may be freely used for any purpose within any web technology.

Acknowledgements
-----

* Author and developer: Bryan Garaventa https://www.linkedin.com/in/bgaraventa
* Website designer: Angela Ricci http://gericci.me
* Style and markup editor: Laurence Lewis https://www.linkedin.com/in/laurence-lewis-77520365/  
* Code contributor: Danny Allen http://dannya.com

Project home:
-----

http://whatsock.com

Related projects:
-----

https://github.com/whatsock