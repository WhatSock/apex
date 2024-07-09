#!/bin/bash
prettier --write "./4X/4X.Max.js" 2> FormatErrors.txt
prettier --write "./4X/4X.Max.Export.js" 2>> FormatErrors.txt
prettier --write "index.htm" 2>> FormatErrors.txt
prettier --write "index.js" 2>> FormatErrors.txt
prettier --write "rollup.config.js" 2>> FormatErrors.txt
prettier --write "./4X/**/*.css" 2>> FormatErrors.txt
prettier --write "./4X/Modules/*{.js,.json}" 2>> FormatErrors.txt
prettier --write "./4X/Standard/Modules/*{.js,.json}" 2>> FormatErrors.txt
prettier --write "./React/src/*{.js,.json,.css}" 2>> FormatErrors.txt
prettier --write "./React/src/**/*{.js,.json,.css}" 2>> FormatErrors.txt
if [ -d "./React/test-react-app/src" ]; then
prettier --write "./React/test-react-app/src/*{.js,.json,.css}" 2>> FormatErrors.txt
prettier --write "./React/test-react-app/src/**/*{.js,.json,.css}" 2>> FormatErrors.txt
fi
prettier --write "./Templates/*{.htm,.html}" 2>> FormatErrors.txt
prettier --write "./Templates/**/*{.js,.json,.css,.htm,.html}" 2>> FormatErrors.txt
prettier --write "./Tutorials/*{.htm,.html}" 2>> FormatErrors.txt
prettier --write "./Tutorials/**/*{.js,.json,.css,.htm,.html}" 2>> FormatErrors.txt
prettier --write "./WhatSock/*{.htm,.html}" 2>> FormatErrors.txt
prettier --write "./WhatSock/**/*{.js,.json,.css,.htm,.html}" 2>> FormatErrors.txt
uglifyjs 4X/4X.Max.js --comments --compress --mangle --output 4X/4X.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/AccName.js --comments --compress --mangle --output 4X/Min/AccName.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Accordion.js --comments --compress --mangle --output 4X/Min/Accordion.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Animate.js --comments --compress --mangle --output 4X/Min/Animate.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Beep.js --comments --compress --mangle --output 4X/Min/Beep.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Button.js --comments --compress --mangle --output 4X/Min/Button.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Carousel.js --comments --compress --mangle --output 4X/Min/Carousel.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Checkbox.js --comments --compress --mangle --output 4X/Min/Checkbox.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Combobox.js --comments --compress --mangle --output 4X/Min/Combobox.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/CurrentDevice.js --comments --compress --mangle --output 4X/Min/CurrentDevice.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Datepicker.js --comments --compress --mangle --output 4X/Min/Datepicker.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Dialog.js --comments --compress --mangle --output 4X/Min/Dialog.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Drag.js --comments --compress --mangle --output 4X/Min/Drag.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Dragdealer.js --comments --compress --mangle --output 4X/Min/Dragdealer.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Dragula.js --comments --compress --mangle --output 4X/Min/Dragula.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Footnote.js --comments --compress --mangle --output 4X/Min/Footnote.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Grid.js --comments --compress --mangle --output 4X/Min/Grid.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Listbox.js --comments --compress --mangle --output 4X/Min/Listbox.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Menu.js --comments --compress --mangle --output 4X/Min/Menu.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Popup.js --comments --compress --mangle --output 4X/Min/Popup.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Radio.js --comments --compress --mangle --output 4X/Min/Radio.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/RovingTabIndex.js --comments --compress --mangle --output 4X/Min/RovingTabIndex.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Slider.js --comments --compress --mangle --output 4X/Min/Slider.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/SmoothScroll.js --comments --compress --mangle --output 4X/Min/SmoothScroll.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Straylight.js --comments --compress --mangle --output 4X/Min/Straylight.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Switch.js --comments --compress --mangle --output 4X/Min/Switch.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Tab.js --comments --compress --mangle --output 4X/Min/Tab.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/TinySlider.js --comments --compress --mangle --output 4X/Min/TinySlider.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Tooltip.js --comments --compress --mangle --output 4X/Min/Tooltip.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Tree.js --comments --compress --mangle --output 4X/Min/Tree.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/Velocity.js --comments --compress --mangle --output 4X/Min/Velocity.js 2>> FormatErrors.txt
uglifyjs 4X/Modules/VelocityUI.js --comments --compress --mangle --output 4X/Min/VelocityUI.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/AccName.js --comments --compress --mangle --output 4X/Standard/Min/AccName.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Accordion.js --comments --compress --mangle --output 4X/Standard/Min/Accordion.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Animate.js --comments --compress --mangle --output 4X/Standard/Min/Animate.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Beep.js --comments --compress --mangle --output 4X/Standard/Min/Beep.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Button.js --comments --compress --mangle --output 4X/Standard/Min/Button.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Carousel.js --comments --compress --mangle --output 4X/Standard/Min/Carousel.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Checkbox.js --comments --compress --mangle --output 4X/Standard/Min/Checkbox.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Combobox.js --comments --compress --mangle --output 4X/Standard/Min/Combobox.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/CurrentDevice.js --comments --compress --mangle --output 4X/Standard/Min/CurrentDevice.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Datepicker.js --comments --compress --mangle --output 4X/Standard/Min/Datepicker.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Dialog.js --comments --compress --mangle --output 4X/Standard/Min/Dialog.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Drag.js --comments --compress --mangle --output 4X/Standard/Min/Drag.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Dragdealer.js --comments --compress --mangle --output 4X/Standard/Min/Dragdealer.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Dragula.js --comments --compress --mangle --output 4X/Standard/Min/Dragula.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Footnote.js --comments --compress --mangle --output 4X/Standard/Min/Footnote.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Grid.js --comments --compress --mangle --output 4X/Standard/Min/Grid.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Listbox.js --comments --compress --mangle --output 4X/Standard/Min/Listbox.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Menu.js --comments --compress --mangle --output 4X/Standard/Min/Menu.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Popup.js --comments --compress --mangle --output 4X/Standard/Min/Popup.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Radio.js --comments --compress --mangle --output 4X/Standard/Min/Radio.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/RovingTabIndex.js --comments --compress --mangle --output 4X/Standard/Min/RovingTabIndex.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Slider.js --comments --compress --mangle --output 4X/Standard/Min/Slider.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/SmoothScroll.js --comments --compress --mangle --output 4X/Standard/Min/SmoothScroll.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Straylight.js --comments --compress --mangle --output 4X/Standard/Min/Straylight.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Switch.js --comments --compress --mangle --output 4X/Standard/Min/Switch.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Tab.js --comments --compress --mangle --output 4X/Standard/Min/Tab.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/TinySlider.js --comments --compress --mangle --output 4X/Standard/Min/TinySlider.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Tooltip.js --comments --compress --mangle --output 4X/Standard/Min/Tooltip.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Tree.js --comments --compress --mangle --output 4X/Standard/Min/Tree.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/Velocity.js --comments --compress --mangle --output 4X/Standard/Min/Velocity.js 2>> FormatErrors.txt
uglifyjs 4X/Standard/Modules/VelocityUI.js --comments --compress --mangle --output 4X/Standard/Min/VelocityUI.js 2>> FormatErrors.txt
./BuildBundle.sh
python ./Templates/_common/_doc_files/Save4X.py 2>> FormatErrors.txt