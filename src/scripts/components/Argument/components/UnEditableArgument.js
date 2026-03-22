import React from 'react';
import PropTypes from 'prop-types';

import './UnEditableArgument.scss';

const UnEditableArgument = ({ argument }) => (
  <div className={'h5p-category-task-non-editable-container'}>
    <p className={'h5p-category-task-element'}>
      {argument}
    </p>
  </div>
);

UnEditableArgument.propTypes = {
  argument: PropTypes.string,
};

export default UnEditableArgument;
