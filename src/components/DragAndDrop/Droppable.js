// @ts-check

import { useDroppable } from '@dnd-kit/core';
import React from 'react';

/**
 * @typedef {{
 *   id: string;
 *   children: React.ReactElement
 * }} Props
 */

/**
 * @param {Props} props
 *
 * @return {React.ReactElement}
 */
export default function Droppable({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      className="h5p-category-task-droppable"
      style={isOver ? { backgroundColor: 'tomato' } : undefined}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
}
