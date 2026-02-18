import classnames from 'classnames';
import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import PropTypes from 'prop-types';

import './Droppable.scss';

/**
 * @typedef {{
 *   id: string;
 *   children: React.ReactElement
 *   isDropDisabled: boolean;
 * }} Props
 */

/**
 * @param {Props} props
 *
 * @return {React.ReactElement}
 */
const Droppable = ({ id, children, isDropDisabled }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { droppableId: id },
    disabled: isDropDisabled,
  });

  return (
    <div
      className={classnames('h5p-category-task-droppable', {
        'h5p-category-task-droppable--active': isOver,
      })}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};

Droppable.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  isDropDisabled: PropTypes.bool,
};

export default Droppable;
