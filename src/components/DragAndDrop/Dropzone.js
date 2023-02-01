import React from 'react';
import classnames from 'classnames';
import Droppable from './Droppable';

/**
 *
 * @param {{
 *   droppablePrefix: 'droppable';
 *   label: string;
 *   disableDrop: boolean;
 *   isDraggingOver: boolean;
 * }} props
 * @returns
 */
function Dropzone({ droppablePrefix, label, disableDrop, isDraggingOver }) {
  return (
    <Droppable id={`${droppablePrefix}-dzone`} isDropDisabled={disableDrop}>
      <div
        className={classnames('h5p-category-task-dropzone', {
          'h5p-category-task-active': isDraggingOver,
        })}
      >
        <div>{label}</div>
      </div>
    </Droppable>
  );
}

export default Dropzone;
