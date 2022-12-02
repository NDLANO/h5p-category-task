// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Draggable from '../Draggable/Draggable';

function Element(props) {

  const {
    children,
    draggableId,
    dragIndex,
    ariaLabel,
  } = props;

  return (
    <Draggable
      id={draggableId}
      // index={dragIndex}
    >
      {/* {(provided, snapshot) => ( */}
      <div
        className={'h5p-category-task-draggable-container'}
        aria-label={ariaLabel}
      >
        <ElementLayout
          // provided={provided}
          // snapshot={snapshot}
          ariaLabel={ariaLabel}
        >
          {children}
        </ElementLayout>
      </div>
      {/* )} */}
    </Draggable>
  );
}

Element.propTypes = {
  draggableId: PropTypes.string,
  dragIndex: PropTypes.number,
  disableTransform: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

function ElementLayout({children, provided, snapshot}) {
  return (
    <div
      className={classnames('h5p-category-task-draggable-element', {
        'h5p-category-task-active-draggable': snapshot.isDragging,
      })}
      // ref={provided.innerRef}
      // {...provided.dragHandleProps}
      // {...provided.draggableProps}
    >
      {children}
    </div>
  );
}

ElementLayout.propTypes = {
  provided: PropTypes.object,
  snapshot: PropTypes.object,
  ariaLabel: PropTypes.string,
};

export {
  Element as default,
  ElementLayout,
};
