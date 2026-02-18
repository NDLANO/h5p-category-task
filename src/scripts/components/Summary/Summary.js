import React, { useState } from 'react';
import classnames from 'classnames';
import { useCategoryTask } from './../../context/CategoryTaskContext.js';
import parseHtml from 'html-react-parser';
import PropTypes from 'prop-types';

import './Summary.scss';

const Summary = ({ disabled }) => {
  const context = useCategoryTask();
  const [comment, setComment] = useState('');

  const {
    registerReset,
    collectExportValues,
    translate,
    params: {
      summaryHeader,
      summaryInstruction,
    }
  } = context;

  collectExportValues('summary', () => comment);
  registerReset(() => setComment(''));

  return (
    <div
      className={classnames('h5p-category-task-summary')}
      aria-labelledby={'summary-header'}
    >
      <label
        className={classnames('h5p-category-task-summary-header')}
        id={'summary-header'}
        htmlFor={'summary'}
      >
        <div>{summaryHeader || translate('summary')}</div>
      </label>
      {summaryInstruction && (
        <div className={classnames('h5p-category-task-summary-instruction')}>{parseHtml(summaryInstruction)}</div>
      )}
      <textarea
        className={classnames('h5p-category-task-summary-textarea')}
        disabled={disabled}
        id={'summary'}
        placeholder={translate('typeYourReasonsForSuchAnswers')}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        aria-label={translate('typeYourReasonsForSuchAnswers')}
      />
    </div>
  );
};

Summary.propTypes = {
  disabled: PropTypes.bool,
};

export default Summary;
