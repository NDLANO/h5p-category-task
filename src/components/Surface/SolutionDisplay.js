import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'html-react-parser';
import './SolutionDisplay.scss';
import { useCategoryTask } from '../../context/CategoryTaskContext';

/**
 * Solution Display component.
 * @param {object} props Component props.
 * @param {object} props.solution Solution object.
 * @returns {object} JSX element.
 */
const SolutionDisplay = ({ solution }) => {
  const { translations } = useCategoryTask();

  return (
    <div className="h5p-category-task-solution-outer-container">
      <div className="h5p-category-task-solution-header">
        {translations.headerSolution || 'Sample solution'}
      </div>
      <div className="h5p-category-task-solution-container">
        {solution.explanation && (
          <div className="h5p-category-task-solution-introduction">
            {ReactHtmlParser(solution.explanation)}
          </div>
        )}
        <div className="h5p-category-task-solution-sample">
          <div className="h5p-category-task-solution-sample-text">
            {ReactHtmlParser(solution.sample)}
          </div>
        </div>
      </div>
    </div>
  );
};

SolutionDisplay.propTypes = {
  solution: PropTypes.shape({
    explanation: PropTypes.string,
    sample: PropTypes.string.isRequired,
  }).isRequired,
};

export default SolutionDisplay;
