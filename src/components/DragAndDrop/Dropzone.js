import React from 'react';
import Droppable from './Droppable.js';

/**
 *
 * @param {{
 *   droppablePrefix: 'droppable';
 *   label: string;
 *   disableDrop: boolean;
 * }} props
 * @returns
 */
function Dropzone({ droppablePrefix, label, disableDrop }) {
  return (
    <Droppable id={`${droppablePrefix}-dzone`} isDropDisabled={disableDrop}>
      <div className={'h5p-category-task-dropzone'}>
        <div>{label}</div>
      </div>
    </Droppable>
  );
}

Dropzone.propTypes = {
  droppablePrefix: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disableDrop: PropTypes.bool,
};

export default Dropzone;
