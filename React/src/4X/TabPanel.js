import React, { useEffect } from "react";

// Import the Apex 4X bundle build.
import "apex4x";

const TabPanel = ({ id, content }) => {
  const $A = window.$A;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const panel = $A.get(id);
    $A.insert(content, panel);
  }, [$A, id, content]);

  return <div className="aria-tab-panel" id={id} hidden />;
};

export default TabPanel;
