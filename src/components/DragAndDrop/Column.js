import { SortableContext } from '@dnd-kit/sortable';
import React from 'react';
import Droppable from './Droppable.js';

/**
 *
 * @param {{
 *   droppableId: string;
 *   disableDrop: boolean;
 *   connectedArguments: Array<number>
 *   children: JSX.Element | Array<JSX.Element | null> | null;
 *   additionalClassName?: string;
 * }} props
 * @returns
 */
function Column({
  droppableId,
  children,
  additionalClassName,
  disableDrop,
  connectedArguments,
}) {
  return (
    <div className={additionalClassName}>
      <SortableContext
        items={connectedArguments.map((argumentId) => `argument-${argumentId}`)}
      >
        <Droppable isDropDisabled={disableDrop} id={droppableId}>
          <div className={'h5p-category-task-column'}>{children}</div>
        </Droppable>
      </SortableContext>
    </div>
  );
}

Column.propTypes = {
  droppableId: PropTypes.string.isRequired,
  disableDrop: PropTypes.bool,
  connectedArguments: PropTypes.arrayOf(PropTypes.number).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  additionalClassName: PropTypes.string,
};

export default Column;
