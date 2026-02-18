import React from 'react';
import PropTypes from 'prop-types';

const UnEditableArgument = ({ argument }) => (
  <p className={'h5p-category-task-element'}>
    {argument}
  </p>
);

UnEditableArgument.propTypes = {
  argument: PropTypes.string,
};

export default UnEditableArgument;
