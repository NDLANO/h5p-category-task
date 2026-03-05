import { escape, decode } from 'he';

/** @constant {number} HEX Hexadecimal radix. */
const HEX = 16;

/** @constant {number} LUMINANCE_FACTOR_RED Red channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_RED = 0.299;

/** @constant {number} LUMINANCE_FACTOR_GREEN Green channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_GREEN = 0.587;

/** @constant {number} LUMINANCE_FACTOR_BLUE Blue channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_BLUE = 0.114;

/** @constant {number} LIGHTNESS_THRESHOLD Lightness threshold for determining light or dark colors. */
const LIGHTNESS_THRESHOLD = 186;

/**
 * @param {{
 *   id?: number | null;
 *   added?: boolean;
 *   argumentText?: string | null;
 *   editMode?: boolean;
 *   prefix?: string
 * }} initValues
 * @returns {ArgumentDataObject}
 */
export function ArgumentDataObject({
  id,
  added,
  argumentText,
  editMode,
  prefix,
}) {
  this.id = id ?? null;
  this.added = added ?? false;
  this.argumentText = argumentText ?? null;
  this.editMode = editMode ?? false;
  this.prefix = prefix ?? 'argument';

  return this;
}

/**
 * @param {{
 *   id: number;
 *   title?: string | null;
 *   connectedArguments?: Array<number>;
 *   isArgumentDefaultList?: boolean;
 *   theme?: string;
 *   useNoArgumentsPlaceholder?: boolean;
 *   prefix?: string;
 *   actionTargetContainer?: boolean,
 *   backgroundColor?: string
 * }} initValues
 *
 * @returns {CategoryDataObject}
 */
export function CategoryDataObject({
  id,
  title,
  connectedArguments,
  isArgumentDefaultList,
  theme,
  useNoArgumentsPlaceholder,
  prefix,
  actionTargetContainer,
  backgroundColor,
}) {
  this.id = id ?? null;
  this.title = title ?? null;
  this.connectedArguments = connectedArguments ?? [];
  this.isArgumentDefaultList = isArgumentDefaultList ?? false;
  this.theme = theme ?? 'h5p-category-task-category-default';
  this.useNoArgumentsPlaceholder = useNoArgumentsPlaceholder ?? false;
  this.prefix = prefix ?? 'category';
  this.actionTargetContainer = actionTargetContainer ?? false;
  this.backgroundColor = backgroundColor ?? '#2679c5';

  return this;
}

/**
 *
 * @param {{
 *   id?: number;
 *   title?: string | null;
 *   activeCategory?: boolean;
 *   onSelect?: () => void;
 *   type?: string;
 *   label?: string}} initValues
 * @returns
 */
export function ActionMenuDataObject({
  id,
  title,
  activeCategory,
  onSelect,
  type,
  label,
}) {
  this.id = id ?? null;
  this.title = title ?? null;
  this.activeCategory = activeCategory ?? null;
  this.onSelect = onSelect ?? null;
  this.type = type ?? null;
  this.label = label ?? null;

  return this;
}

/**
 * @param {CategoryDataObject | ArgumentDataObject} element
 * @returns {string}
 */
export const getDnDId = (element) => {
  return [element.prefix, element.id].join('-');
};

/**
 * @param {() => void} func
 * @param {number} wait
 * @param {boolean} immediate
 * @returns {() => void}
 */
export const debounce = (func, wait, immediate) => {
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
};

/**
 * @param {string} html
 * @returns {string}
 */
export const decodeHTML = (html) => {
  return html ? decode(html) : html;
};

/**
 * @param {string} html
 * @returns {string}
 */
export const escapeHTML = (html) => {
  return html ? escape(html) : html;
};

/**
 * @param {string} html
 * @returns {string}
 */
export const stripHTML = (html) => {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element.innerText;
};

export const sanitizeParams = (params) => {
  const filterResourceList = (element) =>
    Object.keys(element).length !== 0 && element.constructor === Object;
  const handleObject = (sourceObject) => {
    if (sourceObject == null || !filterResourceList(sourceObject)) {
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

  if (resources?.params.resourceList?.filter(filterResourceList).length > 0) {
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
};

/**
 * @template T
 * @param {T} object
 * @returns {T}
 */
export const clone = (object) => {
  return JSON.parse(JSON.stringify(object));
};

/**
 * Check if a number is even
 *
 * @param {number} number
 * @returns {boolean}
 */
export const isEven = (number) => {
  return number % 2 === 0;
};

/**
 * Get lightness of a color based on its RGB values.
 * @param {string} colorCode Color code in 6 char hex: #rrggbb.
 * @returns {number} Lightness value between 0 and 255.
 */
const getLightness = (colorCode) => {
  const r = parseInt(colorCode.substring(1, 3), HEX);
  const g = parseInt(colorCode.substring(3, 5), HEX);
  const b = parseInt(colorCode.substring(5, 7), HEX);

  return LUMINANCE_FACTOR_RED * r + LUMINANCE_FACTOR_GREEN * g + LUMINANCE_FACTOR_BLUE * b;
};

/**
 * Compute focus color to given color.
 * @param {string} colorCode Color code in 6 char hex: #rrggbb.
 * @returns {string} RGB focus color code in 6 char hex: #rrggbb.
 */
export const computeFocusColor = (colorCode) => {
  if (typeof colorCode !== 'string' || !/#[0-9a-fA-F]{6}/.test(colorCode)) {
    return null;
  }

  const lightness = getLightness(colorCode);
  return lightness > LIGHTNESS_THRESHOLD ? '#000000' : '#ffffff';
};
