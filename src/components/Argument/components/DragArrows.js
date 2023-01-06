// @ts-check

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useCategoryTask } from '../../../context/CategoryTaskContext';

function DragArrows({ attributes, listeners }) {
  // const { listeners, attributes } = useDraggable({
  //   id: draggableId,
  //   data: { draggableId },
  // });

  const context = useCategoryTask();

  return (
    <div
      className={'h5p-category-task-drag-element'}
      {...attributes}
      {...listeners}
    >
      <span className="h5p-ri hri-move" aria-hidden={'true'} />
      <span className={'visible-hidden'}>{context.translations.drag}</span>
    </div>
  );
}

export default DragArrows;
