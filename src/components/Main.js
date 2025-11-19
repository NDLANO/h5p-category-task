import './CategoryTask.scss';
import 'fonts/H5PReflectionFont.scss';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import parseHtml from 'html-react-parser';
import Surface from './Surface/Surface.js';
import Footer from './Footer/Footer.js';
import SolutionDisplay from './Surface/SolutionDisplay.js';
import { useCategoryTask } from '../context/CategoryTaskContext.js';

function Main(props) {

  const resourceContainer = useRef();
  const [solution, setSolution] = useState(null);
  const [disableSurface, setDisableSurface] = useState(false);
  const [hideSolutionButton, setHideSolutionButton] = useState(false);
  const context = useCategoryTask();

  const {
    id,
    language = 'en',
    collectExportValues,
    header,
    description = '',
    resources: resourcesList,
    showSolution
  } = props;

  // Workaround to make DnDKit elements non-interactive
  const toggleDnDKitDOMElements = (disabled) => {
    document.querySelectorAll('.h5p-dnd-draggable').forEach((element) => {
      element.classList.toggle('disabled', disabled);
    });
  };

  context.registerReset(() => {
    setSolution(null);
    setDisableSurface(false);
    toggleDnDKitDOMElements(false);
    setHideSolutionButton(false);
  });

  useEffect(() => {
    const filterResourceList = (element) => Object.keys(element).length !== 0 && element.constructor === Object;
    if (resourcesList?.params?.resourceList.filter(filterResourceList).length > 0) {
      const resourceList = new H5P.ResourceList(resourcesList.params, id, language);
      resourceList.attach(resourceContainer.current);

      collectExportValues('resources', () => resourcesList.params.resourceList
        .filter(filterResourceList)
        .map((resource) => Object.assign({}, {
          title: '',
          url: '',
          introduction: '',
        }, resource)) || []);
    }
  }, [resourcesList]);

  let hasSolution = props.solution?.sample?.length > 0 && !props.solution.sample.includes('<div>&nbsp;</div>');

  const handleShowSolution = () => {
    const solutionData = showSolution();
    if (solutionData) {
      setSolution(solutionData);
      setDisableSurface(true);
      toggleDnDKitDOMElements(true);

      setHideSolutionButton(true);

      context.trigger('resize');
    }
    else {
      console.warn('No solution available.');
    }
  };

  return (
    <article>
      <div
        className={'h5p-category-task-header'}
      >{header}</div>
      <div
        className={'h5p-category-task-surface-main'}
      >
        <div
          className={'h5p-category-task-surface-info'}
          ref={resourceContainer}
        >
          {description && (
            <div className={'h5p-category-task-description'}>{parseHtml(description)}</div>
          )}
        </div>
        <Surface disabled={disableSurface} />
      </div>
      {solution && <SolutionDisplay solution={solution} />}
      <Footer showSolution={handleShowSolution} hasSolution={hasSolution && !hideSolutionButton} />
    </article>
  );
}

Main.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  language: PropTypes.string,
  header: PropTypes.string,
  description: PropTypes.string,
  collectExportValues: PropTypes.func,
  resources: PropTypes.object,
  surface: PropTypes.string,
  showSolution: PropTypes.func,
  solution: PropTypes.object,
};

export default Main;
