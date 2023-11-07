import React, {useState, useRef, useEffect} from 'react';
import PropsTypes from 'prop-types';
import classnames from 'classnames';
import {debounce} from '../../utils';
import { useCategoryTask } from '../../../context/CategoryTaskContext';

function EditableArgument(props) {

  const context = useCategoryTask();
  const { translate } = context;

  const [inEditMode, toggleEditMode] = useState(props.inEditMode);

  const inputRef = useRef();

  useEffect(() => {
    if (inEditMode === true) {
      inputRef.current.focus();
    }
  }, []);

  const startEditing = () => {
    if (inEditMode === false) {
      toggleEditMode(true);
      inputRef.current.value = props.argument;
      setTimeout(() => inputRef.current.focus(), 0);
    }
  };

  useEffect(() => {
    if (inEditMode === false && props.inEditMode === true) {
      startEditing();
    }
  }, [props.inEditMode]);

  const stopEditing = () => {
    toggleEditMode(false);
  };

  /**
   * Handle keydown events.
   * KeyDown is used instead of KeyUp to prevent focused input to be blurred
   * when arguments are added with the enter key.
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (inEditMode) {
        stopEditing();
      }
    }
  };

  const id = 'es_' + props.idBase;
  const inputId = 'input_' + id;

  /*
   * TODO: Clean this up. This feels like a very weird construct. Why can't
   *       the `input` element be used on its own? Why the textbox wrapper that
   *       adds an extra level while there already is an input field? Also, why
   *       is ARIA labelling handled that way?
   */
  return (
    <div className={'h5p-category-task-editable-container'}>
      <button
        className={classnames('h5p-category-task-editable-button', {
          'h5p-category-task-editable-button--editing': inEditMode === true,
        })}
        onClick={startEditing}
      >
        <span className={'visible-hidden'}>{`${translate('editArgument')} ${props.argument}`}</span>
      </button>
      <label
        title={props.argument}
        htmlFor={inputId}
        className={classnames('h5p-category-task-editable', {
          'hidden': inEditMode === false,
        })}
      >
        <span className={'visible-hidden'}>Argument</span>
        <input
          className={'h5p-category-task-editable'}
          ref={inputRef}
          onBlur={stopEditing}
          onChange={debounce(() => props.onBlur(inputRef.current.value), 200)}
          onKeyDown={handleKeyDown}
          id={inputId}
        />
      </label>
      <p
        className={classnames('h5p-category-task-noneditable', {
          'hidden': inEditMode === true,
        })}
      >
        {props.argument}
      </p>
    </div>
  );
}

EditableArgument.propTypes = {
  argument: PropsTypes.string,
  inEditMode: PropsTypes.bool,
  onBlur: PropsTypes.func,
  idBase: PropsTypes.oneOfType([
    PropsTypes.string,
    PropsTypes.number,
  ]),
};

EditableArgument.defaultProps = {
  inEditMode: false,
};

export default EditableArgument;
