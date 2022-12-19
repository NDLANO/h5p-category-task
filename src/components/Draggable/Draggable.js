// @ts-check

import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';

/**
 * @typedef {{
 *    id: string;
 *    isDropDisabled?: boolean;
 *    children: JSX.Element | JSX.Element[]
 * }} Props
 */

/**
 * @param {Props} props
 * @return {JSX.Element}
 */
export default function Draggable({ id, isDropDisabled, children }) {
  const { setNodeRef, transform, listeners, attributes } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
