import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Droppable = ({ id, type, children, style }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  const getStyle = () => {
    if (type === 'entity') {
      return { ...style, backgroundColor: isOver ? 'lightgreen' : 'lightblue' };
    } else if (type === 'relationship') {
      return { ...style, backgroundColor: isOver ? 'lightyellow' : 'lightgreen' };
    }
    return style;
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...getStyle(),
        border: '1px solid black',
        padding: '1rem',
        marginBottom: '1rem',
        width: '200px',
      }}
    >
      {children}
    </div>
  );
};

export default Droppable;
