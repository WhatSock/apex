import React, { useEffect, useRef } from "react";

// Import the Apex 4X bundle build.
import "apex4x";

const AccordionToggle = ({
  headingLevel,
  label,
  content,
  isActive,
  groupName,
}) => {
  const $A = window.$A;
  const id = useRef($A.genId()).current;
  const rootId = useRef($A.genId()).current;
  const sectionId = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const toggle = $A.get(id);
    const section = $A.get(sectionId);
    if (isActive === "true") toggle.setAttribute("data-active", isActive);
    $A.insert(content, section);
  }, [
    $A,
    headingLevel,
    rootId,
    sectionId,
    id,
    label,
    content,
    isActive,
    groupName,
  ]);

  return (
    <div className="accordion-section" role="group" aria-labelledby={id}>
      <div
        className="accordion-heading"
        role="heading"
        aria-level={headingLevel || "2"}
      >
        <button
          className="aria-accordion-trigger"
          data-controls={sectionId}
          data-root={rootId}
          id={id}
          data-group={groupName}
        >
          {label}
        </button>
      </div>
      <div id={rootId}>
        <section id={sectionId} hidden />
      </div>
    </div>
  );
};

export default AccordionToggle;
