import { escape, decode } from 'he';

/** @constant {number} HEX Hexadecimal radix. */
const HEX = 16;

/** @constant {number} LUMINANCE_FACTOR_RED Red channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_RED = 0.299;

/** @constant {number} LUMINANCE_FACTOR_GREEN Green channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_GREEN = 0.587;

/** @constant {number} LUMINANCE_FACTOR_BLUE Blue channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_BLUE = 0.114;

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
 * Convert RGB color to relative luminance.
 * @param {number} r Red channel (0-255).
 * @param {number} g Green channel (0-255).
 * @param {number} b Blue channel (0-255).
 * @returns {number} Relative luminance (0-1).
 */
const getRelativeLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return LUMINANCE_FACTOR_RED * rs + LUMINANCE_FACTOR_GREEN * gs + LUMINANCE_FACTOR_BLUE * bs;
};

/**
 * Compute contrast ratio between two colors.
 * @param {string} color1 First color in 6 char hex: #rrggbb.
 * @param {string} color2 Second color in 6 char hex: #rrggbb.
 * @returns {number|null} Contrast ratio (1-21) or null if invalid input.
 */
export const computeContrastRatio = (color1, color2) => {
  if (
    typeof color1 !== 'string' || !/#[0-9a-f]{6}/i.test(color1) ||
    typeof color2 !== 'string' || !/#[0-9a-f]{6}/i.test(color2)
  ) {
    return null;
  }

  const rgb1 = [
    parseInt(color1.substring(1, 3), HEX),
    parseInt(color1.substring(3, 5), HEX),
    parseInt(color1.substring(5, 7), HEX),
  ];

  const rgb2 = [
    parseInt(color2.substring(1, 3), HEX),
    parseInt(color2.substring(3, 5), HEX),
    parseInt(color2.substring(5, 7), HEX),
  ];

  const l1 = getRelativeLuminance(...rgb1);
  const l2 = getRelativeLuminance(...rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
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

  const contrastToWhite = computeContrastRatio(colorCode, '#ffffff');
  const contrastToBlack = computeContrastRatio(colorCode, '#000000');

  if (contrastToWhite > contrastToBlack) {
    return '#ffffff';
  }
  else {
    return '#000000';
  }
};
