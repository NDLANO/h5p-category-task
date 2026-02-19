import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popover as TinyPopover } from 'react-tiny-popover';
import classnames from 'classnames';
import { useCategoryTask } from '../../../context/CategoryTaskContext.js';

import './ActionMenu.scss';

const ActionMenu = (props) => {
  const context = useCategoryTask();
  const { translate } = context;

  const {
    menuId,
    children,
    show,
    handleClose,
    actions,
    classNames = [],
    parentElement,
  } = props;

  const handleClickOutside = (/** @type {PointerEvent} */ event) => {
    /** @type {HTMLElement} */
    const target = event.target;
    const clickedOutsideParentElement = !parentElement.contains(target);

    if (clickedOutsideParentElement && handleClose) {
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener('pointerdown', handleClickOutside);
    return () => window.removeEventListener('pointerdown', handleClickOutside);
  }, [parentElement]);

  classNames.push('h5p-category-task-actionmenu');

  const handleSelect = (callback) => {
    handleClose();
    callback();
  };

  const handleKeyUp = (event, callback) => {
    const enterKey = event.keyCode === 13;
    if (enterKey) {
      handleSelect(callback);
    }
  };

  const parentBox = parentElement.getBoundingClientRect();

  const getCategory = (settings, index) => {
    const label = settings.label ? (
      <span
        id={`action-${index}`}
        className={'h5p-category-task-popover-actionmenu-labeltext'}
      >
        {settings.label}
      </span>
    ) : (
      <span
        id={`action-${index}`}
        className={'h5p-category-task-popover-actionmenu-labeltext'}
      >
        {translate('moveTo')} &quot;<span>{settings.title}</span>&quot;
      </span>
    );

    return (
      <button
        className={'h5p-category-task-popover-actionmenu-button category'}
        type={'button'}
        aria-labelledby={`action-${index}`}
        onClick={(event) => {
          handleKeyUp(event, settings.onSelect);
        }}
      >
        {label}
      </button>
    );
  };

  const getDelete = (settings) => {
    return (
      <button
        className={'h5p-category-task-popover-actionmenu-button delete'}
        type={'button'}
        onClick={(e) => {
          e.preventDefault();
          settings.onSelect();
        }}
      >
        {settings.title}
      </button>
    );
  };

  const getEdit = (settings) => {
    return (
      <button
        className={'h5p-category-task-popover-actionmenu-button edit'}
        type={'button'}
        onClick={(e) => {
          e.preventDefault();
          handleSelect(settings.onSelect);
        }}
      >{settings.title}</button>
    );
  };

  return (
    <TinyPopover
      containerClassName={classNames.join(' ')}
      contentLocation={{
        top: parentBox.top,
        left: -parentBox.left,
      }}
      isOpen={show}
      positions={['bottom']}
      padding={0}
      reposition={false}
      parentElement={parentElement}
      containerStyle={{ position: 'absolute', top: `${parentBox.height}px` }}
      content={() => (
        <div
          id={menuId}
          className={'h5p-category-task-popover-actionmenu-dialog'}
          role={'dialog'}
          aria-labelledby={'actionMenuTitle'}
          aria-describedby={'actionMenuDescription'}
        >
          <div className={'visible-hidden'}>
            <h1 id={'actionMenuTitle'}>{translate('actionMenuTitle')}</h1>
            <p id={'actionMenuDescription'}>
              {translate('actionMenuDescription')}
            </p>
          </div>
          <ul>
            {actions.filter((action) => !action.activeCategory).map((action, index) => {
              let content;
              if (action.type === 'delete') {
                content = getDelete(action);
              }
              else if (action.type === 'edit') {
                content = getEdit(action);
              }
              else {
                content = getCategory(action, index);
              }
              return <li
                key={`action-${index}`}
                className={`h5p-category-task-popover-actionmenu-item ${action.type}`}
              >
                {content}
              </li>;
            })}
          </ul>
          <button
            onClick={handleClose}
            className={'visible-hidden'}
            type={'button'}
          >
            {translate('close')}
          </button>
        </div>
      )}
    >
      {children}
    </TinyPopover>
  );
};

ActionMenu.propTypes = {
  canDelete: PropTypes.bool,
  onDelete: PropTypes.func,
  actions: PropTypes.array,
  translate: PropTypes.func,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  classNames: PropTypes.array,
  parentElement: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  menuId: PropTypes.string,
};

export default ActionMenu;
