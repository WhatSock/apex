import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Tree.css";

// Import the Apex 4X bundle build.
import "apex4x";

const Tree = ({ label, onActivate, treeList, config }) => {
  const $A = window.$A;
  const id = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const container = $A.get(id);
    $A.insert(treeList, container);
    container.querySelector("ul").setAttribute("aria-label", label);

    const handleActivate = (
      ev,
      triggerNode,
      RTI,
      boundElement,
      checked,
      set,
    ) => {
      if (onActivate) {
        onActivate(ev, triggerNode, RTI, boundElement, checked, set);
      }
    };

    $A.setTree(
      `#${id} ul.top.tree`,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Tree.txt
          onActivate: handleActivate,
          animate: {
            onRender: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.slideLeftIn", {
                container: $A.get(id),
                complete: function () {
                  // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                  next();
                },
              });
            },
            onRemove: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.slideLeftOut", {
                container: $A.get(id),
                complete: function () {
                  // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                  next();
                },
              });
            },
          },
        },
        config || {},
      ),
    );
  }, [$A, label, onActivate, treeList, config, id]);

  return (
    <div className="viewport">
      <div role="navigation" className="treeview" id={id} />
    </div>
  );
};

export default Tree;
