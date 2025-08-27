import React from 'react';
import PropTypes from 'prop-types';
import AddArgument from './components/AddArgument';

function Category(props) {
  const {
    additionalClassName,
    categoryId,
    addArgument,
    title,
    makeDiscussion,
    includeHeader,
    onAddArgument,
    children,
    disabled
  } = props;

  additionalClassName.unshift('h5p-category-task-category');

  return (
    <div className={additionalClassName.join(' ')}>
      {includeHeader && (
        <div className={'h5p-category-task-category-header'}>
          {makeDiscussion &&
            (
              <span className={'h5p-discussion-header-icon'}></span>
            )
          }
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
  addArgument: true,
  includeHeader: true,
  disabled: false,
};

export default Category;
