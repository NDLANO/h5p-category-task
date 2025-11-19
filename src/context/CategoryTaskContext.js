import React, { use } from 'react';

const CategoryTaskContext = React.createContext();

function CategoryTaskProvider({ children, value }) {
  return (
    <CategoryTaskContext.Provider value={value}>
      {children}
    </CategoryTaskContext.Provider>
  );
}

function useCategoryTask() {
  const context = use(CategoryTaskContext);
  if (context === undefined) {
    throw new Error('useCategoryTask must be used within a CategoryTaskProvider');
  }
  return context;
}

export {
  CategoryTaskProvider,
  useCategoryTask,
};
