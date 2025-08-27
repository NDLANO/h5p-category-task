import React from 'react';
import Export from '../Export/Export';
import ShowSolutionButton from './ShowSolutionButton.js';
import Reset from './Reset';

function Footer({ showSolution, hasSolution }) {
  return (
    <section className={'h5p-category-task-footer'}>
      <Reset/>
      {hasSolution && <ShowSolutionButton showSolution={showSolution} />}
      <Export/>
    </section>
  );
}

export default Footer;
