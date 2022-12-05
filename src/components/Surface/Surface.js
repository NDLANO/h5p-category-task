import React, {useEffect, useReducer, useCallback} from 'react';
import {getBox} from 'css-box-model';
import {useCategoryTask} from 'context/CategoryTaskContext';
import Summary from '../Summary/Summary';
import {DragDropContext} from 'react-beautiful-dnd';
import * as tweenFunctions from 'tween-functions';
import Category from '../Categories/Category';
import {isMobile} from 'react-device-detect';
import Element from '../DragAndDrop/Element';
import Argument from '../Argument/Argument';
import Column from '../DragAndDrop/Column';
import {CategoryDataObject, ArgumentDataObject, getDnDId, ActionMenuDataObject} from '../utils';

function Surface() {
  const context = useCategoryTask();

  function init() {
    const {
      params: {
        argumentsList: argumentDataList = [],
        categoriesList = [],
      },
      behaviour: {
        randomizeArguments = true,
      }
    } = context;

    if (randomizeArguments === true) {
      argumentDataList.sort(() => 0.5 - Math.random());
    }

    const argumentsList = argumentDataList.map((argument, index) => (new ArgumentDataObject({
      id: index,
      argumentText: argument,
    })));

    const categories = [];
    if (argumentsList.length > 0) {
      categories.push(new CategoryDataObject({
        id: 'unprocessed-1',
        isArgumentDefaultList: true,
        connectedArguments: argumentsList.filter((argument) => argument.id % 2 === 0).map((argument) => argument.id)
      }));
      categories.push(new CategoryDataObject({
        id: 'unprocessed-2',
        isArgumentDefaultList: true,
        connectedArguments: argumentsList.filter((argument) => argument.id % 2 === 1).map((argument) => argument.id)
      }));
    }
    categoriesList.forEach((category, index) => categories.push(new CategoryDataObject({
      id: 'category-' + index,
      theme: 'h5p-category-task-category-container',
      useNoArgumentsPlaceholder: true,
      title: category,
    })));

    return {
      categories,
      argumentsList,
      idCounter: argumentsList.length - 1,
      hasRemainingUnprocessedArguments: argumentsList.length > 0,
      actionDropActive: false,
    };
  }

  function stateHeadQuarter(state, action) {
    switch (action.type) {
      case 'move': {
        const {
          from,
          to
        } = action.payload;
        const newCategories = JSON.parse(JSON.stringify(state.categories));
        const movedArgument = newCategories[newCategories.findIndex((category) => getDnDId(category) === from.droppableId)].connectedArguments.splice(from.index, 1);
        newCategories.map((category) => {
          category.actionTargetContainer = false;
          if (getDnDId(category) === to.droppableId) {
            category.connectedArguments.splice(to.index, 0, movedArgument[0]);
          }
        });
        return {
          ...state,
          categories: newCategories,
          hasRemainingUnprocessedArguments: newCategories.filter((category) => category.isArgumentDefaultList && category.connectedArguments.length > 0).length > 0,
          actionDropActive: false,
        };
      }
      case 'editArgument': {
        const {
          id,
          argumentText,
        } = action.payload;
        const newArguments = JSON.parse(JSON.stringify(state.argumentsList));
        const argumentIndex = newArguments.findIndex((argument) => argument.id === id);
        if (argumentIndex !== -1) {
          const argument = newArguments[argumentIndex];
          argument.argumentText = argumentText;
          argument.editMode = false;
        }
        return {
          ...state,
          argumentsList: newArguments
        };
      }
      case 'deleteArgument': {
        const {
          id
        } = action.payload;
        const categories = JSON.parse(JSON.stringify(state.categories))
          .map((category) => {
            category.connectedArguments = category.connectedArguments.filter((connectedArgument) => connectedArgument !== id);
            return category;
          });
        const argumentsList = state.argumentsList.filter((argument) => argument.id !== id);

        return {
          ...state,
          categories,
          argumentsList,
        };
      }
      case 'addArgument': {
        const {
          id
        } = action.payload;

        const argumentsList = Array.from(state.argumentsList);
        const argumentId = state.idCounter + 1;
        argumentsList.push(new ArgumentDataObject({
          id: argumentId,
          added: true,
          editMode: true,
        }));

        const categories = JSON.parse(JSON.stringify(state.categories));
        const targetIndex = categories.findIndex((category) => category.id === id);
        if (targetIndex === -1) {
          return {
            ...state
          };
        }
        categories[targetIndex].connectedArguments.push(argumentId);
        return {
          ...state,
          argumentsList,
          categories,
          idCounter: argumentId,
        };
      }
      case 'reset': {
        return init();
      }
      case 'setTargetContainer': {
        const newCategories = JSON.parse(JSON.stringify(state.categories));
        return {
          ...state,
          categories: newCategories.map((category) => {
            category.actionTargetContainer = category.id === action.payload.container;
            return category;
          }),
          actionDropActive: true,
        };
      }
      default:
        return state;
    }
  }

  const memoizedReducer = useCallback(stateHeadQuarter, []);
  const [state, dispatch] = useReducer(memoizedReducer, init());

  let api;
  const autoDragSensor = (value) => {
    api = value;
  };

  useEffect(() => {
    context.trigger('resize');
  }, [state.argumentsList, state.categories]);

  const {
    collectExportValues,
    registerReset,
    translate,
    behaviour: {
      allowAddingOfArguments = true,
      provideSummary = true,
    }
  } = context;

  registerReset(() => dispatch({type: 'reset'}));
  collectExportValues('userInput', () => (JSON.parse(JSON.stringify({
    categories: state.categories,
    argumentsList: state.argumentsList
  }))));

  function onDropEnd(dragResult) {
    let {
      destination,
      source,
    } = dragResult;

    if (!destination) {
      return;
    }

    if (Array.isArray(destination.droppableId.match(/(.)+-dzone$/))) {
      destination.droppableId = destination.droppableId.replace('-dzone', '');
      destination.index = state.categories[state.categories.findIndex((category) => getDnDId(category) === destination.droppableId)].connectedArguments.length;
    }

    dispatch({
      type: 'move', payload: {
        from: source,
        to: destination
      }
    });
  }

  function scroll(position) {
    const frame = window.frameElement ? parent : window;
    frame.scrollTo({
      top: position.y,
      behavior: 'smooth',
    });
  }

  function moveStepByStep(drag, values) {
    requestAnimationFrame(() => {
      const newPosition = values.shift();
      drag.move(newPosition);

      if (values.length) {
        moveStepByStep(drag, values);
      }
      else {
        if (isMobile) {
          scroll(newPosition);
        }
        drag.drop();
      }
    });
  }

  const startMoving = function start(draggableElement, target) {
    const preDrag = api.tryGetLock(draggableElement);
    if (!preDrag) {
      return;
    }
    dispatch({type: 'setTargetContainer', payload: {container: target}});
    const targetContainer = getBox(document.getElementById(target));
    const dragElement = getBox(document.getElementById(draggableElement));
    const start = dragElement.borderBox.center;
    const end = {
      x: targetContainer.borderBox.center.x,
      y: targetContainer.borderBox.bottom - (Math.min(15, targetContainer.borderBox.height / 4))
    };
    const drag = preDrag.fluidLift(start);

    const points = [];
    const numberOfPoints = 60;
    for (let i = 0; i < numberOfPoints; i++) {
      points.push({
        x: tweenFunctions.easeOutQuad(i, start.x, end.x, numberOfPoints),
        y: tweenFunctions.easeOutQuad(i, start.y, end.y, numberOfPoints)
      });
    }

    moveStepByStep(drag, points);
  };

  function getDynamicActions(argument) {
    const dynamicActions = state.categories
      .filter((category) => category.isArgumentDefaultList !== true)
      .map((category) => new ActionMenuDataObject({
        id: category.id,
        title: category.title,
        type: 'category',
        activeCategory: category.connectedArguments.findIndex((argumentId) => argumentId === argument.id) !== -1,
        onSelect: () => startMoving(getDnDId(argument), category.id)
      }));
    if (allowAddingOfArguments === true) {
      dynamicActions.push(new ActionMenuDataObject({
        type: 'delete',
        title: translate('deleteArgument'),
        onSelect: () => dispatch({
          type: 'deleteArgument',
          payload: {id: argument.id},
        })
      }));
    }
    return dynamicActions;
  }


  return (
    <div
      className="h5p-category-task-surface"
    >
      <DragDropContext
        onDragEnd={onDropEnd}
        sensors={[autoDragSensor]}
      >
        <Category
          categoryId={'unprocessed'}
          includeHeader={false}
          additionalClassName={['h5p-category-task-unprocessed', !state.hasRemainingUnprocessedArguments ? 'hidden' : '']}
        >
          {state.categories
            .filter((category) => category.isArgumentDefaultList)
            .map((category) => (
              <div
                key={category.id}
              >
                <Column
                  additionalClassName={'h5p-category-task-unprocessed-argument-list'}
                  droppableId={getDnDId(category)}
                  argumentsList={state.argumentsList}
                >
                  {category.connectedArguments
                    .map((argument) => state.argumentsList[state.argumentsList.findIndex((element) => element.id === argument)])
                    .map((argument, index) => (
                      <Element
                        key={getDnDId(argument)}
                        draggableId={getDnDId(argument)}
                        dragIndex={index}
                        ariaLabel={translate('draggableItem', {
                          argument: argument.argumentText
                        })}
                      >
                        <Argument
                          actions={getDynamicActions(argument)}
                          isDragEnabled={!isMobile}
                          argument={argument}
                          enableEditing={allowAddingOfArguments}
                          onArgumentChange={(argumentText) => dispatch({
                            type: 'editArgument',
                            payload: {id: argument.id, argumentText}
                          })}
                        />
                      </Element>
                    ))}
                </Column>
              </div>
            ))}
        </Category>
        {state.categories
          .filter((category) => !category.isArgumentDefaultList)
          .map((category) => (
            <Category
              key={category.id}
              categoryId={category.id}
              includeHeader={category.title !== null}
              title={category.title}
              additionalClassName={[category.theme]}
              addArgument={allowAddingOfArguments}
              onAddArgument={() => dispatch(
                {
                  type: 'addArgument', payload: {
                    id: category.id,
                  }
                })}
            >
              <Column
                additionalClassName={'h5p-category-task-argument-list'}
                droppableId={getDnDId(category)}
                argumentsList={state.argumentsList}
                disableDrop={state.actionDropActive && !category.actionTargetContainer}
              >
                {category.useNoArgumentsPlaceholder && category.connectedArguments.length === 0 && (
                  <span>{translate(allowAddingOfArguments ? 'dropExistingOrAddNewArgument' : 'dropArgumentsHere')}</span>
                )}
                {category.connectedArguments
                  .map((argument) => state.argumentsList[state.argumentsList.findIndex((element) => element.id === argument)])
                  .map((argument, index) => (
                    <Element
                      key={getDnDId(argument)}
                      draggableId={getDnDId(argument)}
                      dragIndex={index}
                      ariaLabel={translate('draggableItem', {
                        statement: argument.argumentText
                      })}
                    >
                      <Argument
                        actions={getDynamicActions(argument)}
                        isDragEnabled={!isMobile}
                        argument={argument}
                        enableEditing={allowAddingOfArguments}
                        onArgumentChange={(argumentText) => dispatch({
                          type: 'editArgument',
                          payload: {id: argument.id, argumentText}
                        })}
                      />
                    </Element>
                  ))}
              </Column>
            </Category>
          ))}
      </DragDropContext>
      {provideSummary === true && (
        <Summary/>
      )}
    </div>
  );
}

export default Surface;
