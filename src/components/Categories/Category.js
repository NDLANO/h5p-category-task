import React from 'react';
import PropTypes from 'prop-types';
import AddArgument from './components/AddArgument.js';
import { computeFocusColor } from '../utils.js';

function Category(props) {
  const {
    additionalClassName,
    categoryId,
    addArgument,
    title,
    backgroundColor,
    includeHeader,
    onAddArgument,
    children,
    disabled
  } = props;

  additionalClassName.unshift('h5p-category-task-category');

  return (
    <div className={additionalClassName.join(' ')}>
      {includeHeader && (
        <div
          className={'h5p-category-task-category-header'}
          style={{
            '--background-color': backgroundColor,
            '--color': computeFocusColor(backgroundColor),
          }}
        >
          {title}
        </div>
      )}
      <div className={'h5p-category-task-category-content'} id={categoryId}>
        {children}
        {addArgument && <AddArgument disabled={disabled} onClick={onAddArgument} />}
      </div>
    </div>
  );
}

Category.propTypes = {
  additionalClassName: PropTypes.array,
  categoryId: PropTypes.string.isRequired,
  title: PropTypes.string,
  backgroundColor: PropTypes.string,
  addArgument: PropTypes.bool,
  includeHeader: PropTypes.bool,
  onAddArgument: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  disabled: PropTypes.bool
};

Category.defaultProps = {
  columnClassName: [],
  additionalClassName: [],
  title: '',
  backgroundColor: '#2679c5',
  addArgument: true,
  includeHeader: true,
  disabled: false,
  children: null,
  onAddArgument: () => {},
};

export default Category;
