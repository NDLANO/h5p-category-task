import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import EditableArgument from "./components/EditableArgument";
import UnEditableArgument from "./components/UnEditableArgument";
import ActionMenu from "./components/ActionMenu";
import classnames from "classnames";
import DragArrows from "./components/DragArrows";
import {getDnDId} from "../utils";

function Argument(props) {

  const innerRef = useRef();
  const [refReady, setRef] = useState(false);

  const {
    argument,
    onArgumentChange,
    enableEditing = false,
    isDragging = false,
    isDragEnabled = true,
    actions,
  } = props;

  const [showPopover, togglePopover] = useState(false);

  function toggle() {
    togglePopover(prevState => !prevState);
  }

  useEffect(() => {
    setRef(true);
  }, [innerRef]);

  let displayStatement;
  if (enableEditing) {
    displayStatement = (
      <EditableArgument
        argument={argument.argumentText}
        inEditMode={argument.editMode}
        onBlur={onArgumentChange}
        idBase={argument.id}
      />
    );
  }
  else {
    displayStatement = (
      <UnEditableArgument
        argument={argument.argumentText}
      />
    );
  }

  let argumentLayout = (
    <ArgumentLayout
      activeDraggable={isDragEnabled && isDragging}
      isDragEnabled={isDragEnabled}
      statementDisplay={displayStatement}
      toggle={toggle}
    />
  );

  if ( Array.isArray(actions) && actions.length > 0  && refReady) {
    argumentLayout = (
      <ActionMenu
        actions={actions}
        show={showPopover}
        handleClose={toggle}
        innerRef={innerRef.current}
      >
        {argumentLayout}
      </ActionMenu>
    );
  }

  return (
    <div
      id={getDnDId(argument)}
      aria-expanded={showPopover}
      ref={innerRef}
    >
      {argumentLayout}
    </div>
  );
}

Argument.propTypes = {
  argument: PropTypes.object,
  onArgumentChange: PropTypes.func,
  enableEditing: PropTypes.bool,
  onArgumentDelete: PropTypes.func,
  isDragging: PropTypes.bool,
  isDragEnabled: PropTypes.bool,
  actions: PropTypes.array,
};

function ArgumentLayout(props) {

  const {
    activeDraggable,
    isDragEnabled,
    statementDisplay,
    toggle,
  } = props;

  return (
    <div
      className={"h5p-category-task-argument-container"}
    >
      <div
        className={classnames("h5p-category-task-argument", {
          "h5p-category-task-active-draggable": activeDraggable
        })}
      >
        <div
          className={"h5p-category-task-argument-provided"}
        >
          {isDragEnabled && (
            <DragArrows/>
          )}
          {statementDisplay}
          <button
            className={"h5p-category-task-argument-actions"}
            aria-label={"See available actions"}
            onClick={toggle}
            type={"button"}
          >
            <span className={"fa fa-caret-down"}/>
          </button>
        </div>
      </div>
    </div>
  );
}

ArgumentLayout.propTypes = {
  activeDraggable: PropTypes.bool,
  isDragEnabled: PropTypes.bool,
  statementDisplay: PropTypes.object,
  toggle: PropTypes.func,
};

ArgumentLayout.defaultProps = {
  toggle: () => {
  },
  isDragEnabled: true,
  activeDraggable: false,
};

export {
  Argument as default,
  ArgumentLayout
};