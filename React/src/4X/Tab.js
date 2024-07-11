import React, { useEffect } from "react";

// Import the Apex 4X bundle build.
import "apex4x";

const Tab = ({ label, isActive, groupName, id, rootId, controlsId }) => {
  const $A = window.$A;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const tab = $A.get(id);
    if (isActive === "true") tab.setAttribute("data-active", isActive);
  }, [$A, id, rootId, controlsId, label, isActive, groupName]);

  return (
    <button
      className="aria-tab"
      id={id}
      data-root={rootId}
      data-controls={controlsId}
      data-group={groupName}
    >
      <span>{label}</span>
    </button>
  );
};

export default Tab;
