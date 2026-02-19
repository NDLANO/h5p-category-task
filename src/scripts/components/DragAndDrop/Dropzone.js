import React from 'react';
import Droppable from './Droppable.js';
import PropTypes from 'prop-types';

import './Dropzone.scss';

/**
 *
 * @param {{
 *   droppablePrefix: 'droppable';
 *   label: string;
 *   disableDrop: boolean;
 * }} props
 * @returns
 */
const Dropzone = ({ droppablePrefix, label, disableDrop }) => (
  <Droppable id={`${droppablePrefix}-dzone`} isDropDisabled={disableDrop}>
    <div className={'h5p-category-task-dropzone'}>
      {label}
    </div>
  </Droppable>
);

Dropzone.propTypes = {
  droppablePrefix: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disableDrop: PropTypes.bool,
};

export default Dropzone;
