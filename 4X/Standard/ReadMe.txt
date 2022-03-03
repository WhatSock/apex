
For those wishing to load 4X using the standard script tag instead of using dynamic module imports, the following order should be observed to ensure that all module dependencies are loaded correctly.

Simply copy and paste the below list into the head tag of your webpage, 
delete the module scripts that you don't wish to use,
and change the href and src attribute paths to point to the correct modules within the 4X/Standard folder.
Then a simple setup script can be loaded to configure all desired functionality.

Note: For testing purposes, all of the below declarations have been added to the index.htm file at the root of this archive.

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
