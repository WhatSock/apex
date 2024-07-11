import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./TabList.css";

// Import the Apex 4X bundle build.
import "apex4x";

import Tab from "./Tab";
import TabPanel from "./TabPanel";

const TabList = ({ groupName, tabs, config }) => {
  const $A = window.$A;
  const id = useRef($A.genId()).current;
  const rootId = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here

    $A.setTab(
      `button.aria-tab[data-group="${groupName}"]`,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Tab.txt
          isToggle: false,
          toggleClassName: "active",
          toggleHide: true,
          // Optionally run a script after the tab panel finishes rendering.
          afterRender: function (DC) {
            // DC.container includes the rendered tab content.
          },
          // Optionally run a script after the tab panel is removed.
          afterRemove: function (DC) {
            // Do something.
          },
          /* Uncomment to set animation effects.
    animate: {
      onRender: function(dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.fadeIn", {
          duration: 1000,
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      },
      onRemove: function(dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.fadeOut", {
          duration: 1000,
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      }
    },
*/
        },
        config || {},
      ),
    );
  }, [$A, id, rootId, groupName, tabs, config]);

  return (
    <div>
      <div className="aria-tab-list">
        {tabs.map((tab, i) => (
          <Tab
            key={i}
            groupName={groupName}
            label={tab.label}
            isActive={tab.active === "true" ? "true" : "false"}
            id={`${id}-${i}`}
            controlsId={`${id}-c-${i}`}
            rootId={rootId}
          />
        ))}
      </div>
      <div className="aria-tab-root" id={rootId}>
        {tabs.map((tab, i) => (
          <TabPanel key={i} id={`${id}-c-${i}`} content={tab.content} />
        ))}
      </div>
    </div>
  );
};

export default TabList;
