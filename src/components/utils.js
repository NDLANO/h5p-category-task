import { escape, decode } from 'he';

export function ArgumentDataObject(initValues) {
  this.id = null;
  this.added = false;
  this.argumentText = null;
  this.editMode = false;
  this.prefix = 'argument';

  return Object.assign(this, initValues);
}

/**
 * @param {{
 *   id: string;
 *   title?: string;
 *   connectedArguments?: Array<ArgumentDataObject>;
 *   isArgumentDefaultList?: boolean;
 *   theme?: string;
 *   useNoArgumentsPlaceholder?: boolean;
 *   prefix?: string;
 *   actionTargetContainer?: boolean
 * }} initValues
 * @returns {CategoryDataObject}
 */
export function CategoryDataObject(initValues) {
  this.id = null;
  this.title = null;
  this.connectedArguments = [];
  this.isArgumentDefaultList = false;
  this.theme = 'h5p-category-task-category-default';
  this.useNoArgumentsPlaceholder = false;
  this.prefix = 'category';
  this.actionTargetContainer = false;

  return Object.assign(this, initValues);
}

export function ActionMenuDataObject(initValues) {
  this.id = null;
  this.title = null;
  this.activeCategory = null;
  this.onSelect = null;
  this.type = null;
  this.label = null;

  return Object.assign(this, initValues);
}

/**
 * @param {CategoryDataObject | ArgumentDataObject} element 
 * @returns {string}
 */
export function getDnDId(element) {
  return [element.prefix, element.id].join('-');
}

/**
 * 
 * @param {() => void} func 
 * @param {number} wait 
 * @param {boolean} immediate 
 * @returns {() => void}
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function decodeHTML(html) {
  return html ? decode(html) : html;
}

export function escapeHTML(html) {
  return html ? escape(html) : html;
}

/**
 * @param {string} html 
 * @returns {string}
 */
export function stripHTML(html) {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element.innerText;
}

export function sanitizeParams(params) {
  const filterResourceList = (element) =>
    Object.keys(element).length !== 0 && element.constructor === Object;
  const handleObject = (sourceObject) => {
    if (
      sourceObject === undefined ||
      sourceObject === null ||
      !filterResourceList(sourceObject)
    ) {
      return sourceObject;
    }
    return Object.keys(sourceObject).reduce((aggregated, current) => {
      aggregated[current] = decodeHTML(sourceObject[current]);
      return aggregated;
    }, {});
  };

  let {
    header,
    description,
    argumentsList,
    summary,
    summaryHeader,
    summaryInstruction,
    l10n,
    resourceReport,
    resources,
  } = params;

  if (Array.isArray(argumentsList)) {
    argumentsList = argumentsList.map((argument) => decodeHTML(argument));
  }

  if (
    resources.params.resourceList &&
    resources.params.resourceList.filter(filterResourceList).length > 0
  ) {
    resources.params = {
      ...resources.params,
      l10n: handleObject(resources.params.l10n),
      resourceList: resources.params.resourceList
        .filter(filterResourceList)
        .map((resource) => {
          const { title, introduction } = resource;
          return {
            ...resource,
            title: decodeHTML(title),
            introduction: decodeHTML(introduction),
          };
        }),
    };
  }

  return {
    ...params,
    argumentsList,
    resources,
    header: decodeHTML(header),
    description: decodeHTML(description),
    summary: decodeHTML(summary),
    summaryHeader: decodeHTML(summaryHeader),
    summaryInstruction: decodeHTML(summaryInstruction),
    l10n: handleObject(l10n),
    resourceReport: handleObject(resourceReport),
  };
}

/**
 * CSS classnames and breakpoints for the content type
 */
const CategoryTaskClassnames = {
  mediumTablet: 'h5p-medium-tablet-size',
  largeTablet: 'h5p-large-tablet-size',
  large: 'h5p-large-size',
};

/**
 * Get list of classname and conditions for when to add the classname to the content type
 *
 * @return {[{className: string, shouldAdd: (function(*): boolean)}, {className: string, shouldAdd: (function(*): boolean|boolean)}, {className: string, shouldAdd: (function(*): boolean)}]}
 */
export const breakpoints = () => {
  return [
    {
      className: CategoryTaskClassnames.mediumTablet,
      shouldAdd: (ratio) => ratio >= 22 && ratio < 40,
    },
    {
      className: CategoryTaskClassnames.largeTablet,
      shouldAdd: (ratio) => ratio >= 40 && ratio < 60,
    },
    {
      className: CategoryTaskClassnames.large,
      shouldAdd: (ratio) => ratio >= 60,
    },
  ];
};

/**
 * Get the ratio of the container
 *
 * @return {number}
 */
export function getRatio(container) {
  if (!container) {
    return;
  }
  const computedStyles = window.getComputedStyle(container);
  return (
    container.offsetWidth /
    parseFloat(computedStyles.getPropertyValue('font-size'))
  );
}

/**
 * @template T
 * @param {T} object 
 * @returns {T}
 */
export function clone(object) {
  return JSON.parse(JSON.stringify(object));
}
