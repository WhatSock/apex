import React, { useEffect } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./AccordionGroup.css";

// Import the Apex 4X bundle build.
import "apex4x";

import AccordionToggle from "./AccordionToggle";

const AccordionGroup = ({ groupName, headingLevel, accordions, config }) => {
  const $A = window.$A;

  useEffect(() => {
    // Initialize or use $A functionalities here

    $A.setAccordion(
      `.aria-accordion-trigger[data-group="${groupName}"]`,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Accordion.txt
          toggleClassName: "open",
          toggleHide: true,
          isToggle: true,
          allowMultiple: false,
          // Optionally run a script after the accordion panel finishes rendering.
          afterRender: function (DC) {
            // DC.container includes the rendered accordion content.
          },
          // Optionally run a script after the accordion panel is removed.
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
  }, [$A, groupName, headingLevel, accordions, config]);

  return (
    <div className="aria-accordion-group">
      {accordions.map((accordion, i) => (
        <AccordionToggle
          key={i}
          groupName={groupName}
          headingLevel={headingLevel}
          label={accordion.label}
          content={accordion.content}
          isActive={accordion.active === "true" ? "true" : "false"}
        />
      ))}
    </div>
  );
};

export default AccordionGroup;
