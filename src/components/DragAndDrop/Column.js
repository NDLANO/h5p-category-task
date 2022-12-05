import React from 'react';
import PropTypes from 'prop-types';
import {Droppable} from 'react-beautiful-dnd';
import classnames from 'classnames';
import {getDnDId} from '../utils';
import {ElementLayout} from './Element';
import {ArgumentLayout} from '../Argument/Argument';
import UnEditableArgument from '../Argument/components/UnEditableArgument';


function Column({
  droppableId,
  children,
  additionalClassName,
  argumentsList,
  disableDrop,
}) {
  return (
    <div
      className={additionalClassName}
    >
      <Droppable
        isDropDisabled={disableDrop}
        droppableId={droppableId}
        renderClone={(provided, snapshot, rubrics) => {
          const index = argumentsList.findIndex((element) => getDnDId(element) === rubrics.draggableId);
          const argument = argumentsList[index];
          return (
            <ElementLayout
              provided={provided}
              snapshot={snapshot}
            >
              <ArgumentLayout
                activeDraggable={true}
                statementDisplay={<UnEditableArgument argument={argument.argumentText}/>}
              />
            </ElementLayout>
          );
        }}
      >
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classnames('h5p-category-task-column', {
                'h5p-category-task-drag-active': snapshot.isDraggingOver && snapshot.draggingFromThisWith === null
              })}
            >
              {children}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

Column.propTypes = {
  droppableId: PropTypes.string.isRequired,
  additionalClassName: PropTypes.string,
};

Column.defaultProps = {
  droppableId: null,
  additionalClassName: null,
};

export default Column;
