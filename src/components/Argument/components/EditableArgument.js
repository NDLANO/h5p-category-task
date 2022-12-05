import React, {useState, useRef, useEffect} from 'react';
import PropsTypes from 'prop-types';
import classnames from 'classnames';
import {debounce} from '../../utils';

function EditableArgument(props) {

  const [inEditMode, toggleEditMode] = useState(props.inEditMode);

  const inputRef = useRef();

  useEffect(() => {
    if (inEditMode === true) {
      inputRef.current.focus();
    }
  }, []);

  const handleClick = () => {
    if (inEditMode === false) {
      toggleEditMode(true);
      inputRef.current.value = props.argument;
      setTimeout(() => inputRef.current.focus(), 0);
    }
  };

  const handleBlur = () => {
    toggleEditMode(false);
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      if ( inEditMode ) {
        handleBlur();
      }
      else {
        handleClick();
      }
    }
  };

  const id = 'es_' + props.idBase;
  const labelId = 'label_' + id;
  const inputId = 'input_' + id;
  return (
    <div
      role={'textbox'}
      tabIndex={0}
      onClick={handleClick}
      className={'h5p-category-task-editable-container'}
      onKeyUp={handleKeyUp}
      aria-labelledby={labelId}
    >
      <div>
        <label
          title={props.argument}
          htmlFor={inputId}
          id={labelId}
          className={classnames('h5p-category-task-editable', {
            'hidden': inEditMode === false,
          })}
        >
          <span className={'visible-hidden'}>Argument</span>
          <input
            className={'h5p-category-task-editable'}
            ref={inputRef}
            onBlur={handleBlur}
            onChange={debounce(() => props.onBlur(inputRef.current.value), 200)}
            aria-label={'Edit argument ' + props.argument}
            aria-hidden={!inEditMode}
            id={inputId}
          />
        </label>
        <p
          aria-hidden={inEditMode}
          className={classnames('h5p-category-task-noneditable', {
            'hidden': inEditMode === true,
          })}
        >
          {props.argument}
        </p>
      </div>
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