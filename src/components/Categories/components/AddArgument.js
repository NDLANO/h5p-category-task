import React from 'react';
import PropTypes from 'prop-types';
import {useCategoryTask} from 'context/CategoryTaskContext';

function AddArgument(props) {

  const context = useCategoryTask();
  const {
    onClick,
  } = props;

  return (
    <button
      aria-label={context.translate('addArgument')}
      className={'h5p-category-task-header-argument-add'}
      onClick={onClick}
      type={'button'}
    >
      <span
        className={'h5p-category-task-argument-add-icon fa fa-plus'}
        aria-hidden={true}
      />
      <span className={'h5p-category-task-argument-add-text'}>{context.translate('addArgument')}</span>
    </button>
  );
}

AddArgument.propTypes = {
  displayFull: PropTypes.bool,
  onClick: PropTypes.func,
};

export default AddArgument;