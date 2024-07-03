import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Menu.css";

// Import the Apex 4X bundle build.
import "apex4x";

const Menu = ({ buttonLabel, onActivate, menuList, config }) => {
  const $A = window.$A;
  const buttonId = useRef($A.genId()).current;
  const menuId = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const menuButton = $A.get(buttonId);
    menuButton.parentNode.appendChild($A.morph(menuList));
    const menu = $A.next(menuButton);
    menu.setAttribute("id", menuId);
    menuButton.setAttribute("data-menu", menuId);

    const handleActivate = (
      ev,
      triggerNode,
      RTI,
      boundElement,
      checked,
      set,
      isRadio,
    ) => {
      if (onActivate) {
        onActivate(ev, triggerNode, RTI, boundElement, checked, set, isRadio);
      }
    };

    $A.setMenu(
      menuButton,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Menu.txt
          toggleHide: true,
          onActivate: handleActivate,
          animate: {
            onRender: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.slideUpIn", {
                duration: 1000,
                complete: function () {
                  next();
                },
              });
            },
            onRemove: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.slideUpOut", {
                duration: 1000,
                complete: function () {
                  next();
                },
              });
            },
          },
        },
        config || {},
      ),
    );
  }, [$A, buttonLabel, onActivate, menuList, config, buttonId, menuId]);

  return (
    <span>
      <button className="aria-menu" id={buttonId}>
        <span>{buttonLabel}</span>
      </button>
    </span>
  );
};

export default Menu;
