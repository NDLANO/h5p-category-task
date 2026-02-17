import React from 'react';
import Export from '../Export/Export.js';
import ShowSolutionButton from './ShowSolutionButton.js';
import Reset from './Reset.js';
import PropTypes from 'prop-types';

function Footer({ showSolution, hasSolution }) {
  return (
    <section className={'h5p-category-task-footer'}>
      <Reset/>
      {hasSolution && <ShowSolutionButton showSolution={showSolution} />}
      <Export/>
    </section>
  );
}

Footer.propTypes = {
  showSolution: PropTypes.bool,
  hasSolution: PropTypes.bool,
};

export default Footer;
