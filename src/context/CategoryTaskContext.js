import React, { useContext } from 'react';
import PropTypes from 'prop-types';

const CategoryTaskContext = React.createContext();
function CategoryTaskProvider({ children, value }) {
  return (
    <CategoryTaskContext.Provider value={value}>
      {children}
    </CategoryTaskContext.Provider>
  );
}

CategoryTaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.object.isRequired,
};

function useCategoryTask() {
  const context = useContext(CategoryTaskContext);
  if (context === undefined) {
    throw new Error('useCategoryTask must be used within a CategoryTaskProvider');
  }
  return context;
}

export {
  CategoryTaskProvider,
  useCategoryTask,
};
