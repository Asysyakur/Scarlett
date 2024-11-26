import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const Draggable = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
        transition,
        padding: '1rem',
        border: '1px solid black',
        backgroundColor: 'yellow',
        cursor: 'move',
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default Draggable;
