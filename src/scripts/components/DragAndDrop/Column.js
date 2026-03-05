import { SortableContext } from '@dnd-kit/sortable';
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Droppable from './Droppable.js';

import './Column.scss';

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
const Column = ({
  droppableId,
  children,
  additionalClassName,
  disableDrop,
  connectedArguments,
}) => {
  const columnRef = useRef(null);
  const [childHeight, setChildHeight] = useState(null);

  useEffect(() => {
    if (additionalClassName === 'h5p-category-task-unprocessed-argument-list' && columnRef.current) {
      const firstChild = columnRef.current.querySelector('.h5p-category-task-column > *:first-child');

      if (firstChild) {
        setChildHeight(firstChild.offsetHeight);
      }
    }
  }, [additionalClassName, children]);

  const containerStyle = {};
  if (childHeight && additionalClassName === 'h5p-category-task-unprocessed-argument-list') {
    containerStyle['--child-height'] = `${childHeight}px`;
  }

  return (
    <div ref={columnRef} className={additionalClassName} style={containerStyle}>
      <SortableContext
        items={connectedArguments.map((argumentId) => `argument-${argumentId}`)}
      >
        <Droppable isDropDisabled={disableDrop} id={droppableId}>
          <div className={'h5p-category-task-column'}>{children}</div>
        </Droppable>
      </SortableContext>
    </div>
  );
};

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
