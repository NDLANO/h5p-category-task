import React from 'react';
import PropTypes from 'prop-types';
import { useCategoryTask } from './../../../context/CategoryTaskContext.js';

import './AddArgument.scss';

const AddArgument = ({ onClick, disabled }) => {
  const context = useCategoryTask();

  return (
    <button
      aria-label={context.translate('addArgument')}
      className={'h5p-category-task-add-button'}
      onClick={onClick}
      type={'button'}
      disabled={disabled}
    >
      {context.translate('addArgument')}
    </button>
  );
};

AddArgument.propTypes = {
  displayFull: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default AddArgument;
