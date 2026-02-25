import React from 'react';
import classnames from 'classnames';
import { CSS } from '@dnd-kit/utilities';
import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import PropTypes from 'prop-types';

import './Element.scss';

/**
 * @param {{
 *   draggableId: string;
 *   ariaLabel: string;
 *   renderChildren: (
 *     isDragging: boolean,
 *   ) => JSX.Element | Array<JSX.Element | null> | null,
 *  index?: number;
 * }} props
 * @returns
 */
const Element = ({ draggableId, ariaLabel, renderChildren, index = 0 }) => {
  /** @type {import('@dnd-kit/sortable').AnimateLayoutChanges} */
  const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const { setNodeRef, transform, transition, attributes, listeners, isDragging } =
    useSortable({
      id: draggableId,
      data: { draggableId },
      animateLayoutChanges,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    cursor: 'grab',
    '--index': index ?? 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classnames('h5p-dnd-draggable', {
        'h5p-dnd-draggable--dragging': isDragging,
      })}
      {...attributes}
      {...listeners}
    >
      <div
        className={'h5p-category-task-draggable-container'}
        aria-label={ariaLabel}
      >
        <ElementLayout
          ariaLabel={ariaLabel}
          isDragging={isDragging}
        >
          {renderChildren(isDragging)}
        </ElementLayout>
      </div>
    </div>
  );
};

Element.propTypes = {
  draggableId: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  renderChildren: PropTypes.func.isRequired,
  index: PropTypes.number,
};

/**
 * @param {{
 *   children: JSX.Element | Array<JSX.Element | null> | null;
 *   isDragging: boolean;
 *   ariaLabel: string;
 * }} props
 *
 * @returns {JSX.Element}
 */
const ElementLayout = ({ children, isDragging, ariaLabel }) => (
  <div
    className={classnames('h5p-category-task-draggable-element', {
      'h5p-category-task-active-draggable': isDragging,
      'h5p-category-task-draggable-element--dragging': isDragging,
    })}
    aria-label={ariaLabel}
  >
    {children}
  </div>
);

ElementLayout.propTypes = {
  children: PropTypes.node,
  isDragging: PropTypes.bool.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

export { Element as default, ElementLayout };
