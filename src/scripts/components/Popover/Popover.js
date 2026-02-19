import React, { useEffect, useRef } from 'react';

import { ArrowContainer, Popover as TinyPopover } from 'react-tiny-popover';
import PropTypes from 'prop-types';

import './Popover.scss';

const Popover = ({
  handleClose,
  show = false,
  children,
  popoverContent,
  classnames = [],
  header,
  close,
  align = 'end',
  openerRect,
  parentElement,
}) => {
  classnames.push('h5p-category-task-popover');
  const popoverRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (show && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [show]);

  // Trap focus within the popover and handle Escape key
  const handleKeyDown = (event) => {
    if (!show) return;

    const focusableElements = popoverRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    if (event.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <TinyPopover
      parentElement={parentElement}
      containerClassName={classnames.join(' ')}
      isOpen={show}
      positions={['top', 'bottom']}
      padding={10}
      containerStyle={{
        overflow: 'unset',
      }}
      align={align}
      onClickOutside={handleClose}
      content={({ position, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={openerRect}
          popoverRect={popoverRect}
          arrowColor={'white'}
          arrowSize={10}
          className="popover-arrow-container"
        >
          <div
            className={'h5p-category-task-popover-container'}
            role="dialog"
            aria-modal="true"
            ref={popoverRef}
            onKeyDown={handleKeyDown}
          >
            <div className={'h5p-category-task-popover-header'}>
              <div>
                {header}
              </div>
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Escape' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    handleClose();
                  }
                }}
                aria-label={close}
                type={'button'}
                className={'close-button'}
              >
              </button>
            </div>
            <div
              className={'h5p-category-task-popover-content'}
            >
              {popoverContent}
            </div>
          </div>
        </ArrowContainer>
      )}
    >
      {children}
    </TinyPopover>
  );
};

Popover.propTypes = {
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  popoverContent: PropTypes.object,
  classnames: PropTypes.array,
  header: PropTypes.string,
  close: PropTypes.string,
  openerRect: PropTypes.object,
  align: PropTypes.string,
  children: PropTypes.node.isRequired,
  parentElement: PropTypes.oneOf([PropTypes.instanceOf(HTMLElement), undefined]),
};

export default Popover;
