import React from 'react';
import PropTypes from 'prop-types';
import {useCategoryTask} from 'context/CategoryTaskContext';

/**
 * Show Solution button component.
 * @param {object} props Component props.
 * @param {function} props.showSolution Function to show the solution.
 * @returns {object} JSX element.
 */
const ShowSolutionButton = ({ showSolution }) => {
  const categoryTaskContext = useCategoryTask();
  const { translations } = categoryTaskContext;

  return (
    <button
      onClick={showSolution}
      className="h5p-category-task-footer-button h5p-category-task-button-show-solution"
    >
      <span
        className={'h5p-ri hri-show-solution'}
      />
      {translations.showSolution}
    </button>
  );
};

ShowSolutionButton.propTypes = {
  showSolution: PropTypes.func.isRequired,
};

export default ShowSolutionButton;
