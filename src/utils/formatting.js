/**
 * @module src/utils/formatting.js
 *
 * Utility functions for formatting text and data.
 */

const stringWidth = require('string-width');

/**
 * Strips HTML tags from a string.
 *
 * @param {string} str The string to strip tags from.
 * @returns {string} The string with HTML tags removed.
 */
const stripTags = (str) => str.replace(/<[^>]+>/g, '');

/**
 * Centers a string within a specified width.
 *
 * @param {string} str The string to center.
 * @param {number} [width=80] The width to center the string within.
 * @returns {string} The centered string.
 */
const center = (str, width = 80) => {
  const len = stringWidth(stripTags(str));
  if (len >= width) return str;
  const pad = width - len;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + str + ' '.repeat(right);
};

/**
 * Pads a string to the right with spaces to a specified width.
 *
 * @param {string} str The string to pad.
 * @param {number} width The desired width of the padded string.
 * @returns {string} The right-padded string.
 */
const padRight = (str, width) => {
  const len = stringWidth(stripTags(str));
  return str + ' '.repeat(Math.max(0, width - len));
};

/**
 * Pads a string to the left with spaces to a specified width.
 *
 * @param {string} str The string to pad.
 * @param {number} width The desired width of the padded string.
 * @returns {string} The left-padded string.
 */
const padLeft = (str, width) => {
  const len = stringWidth(stripTags(str));
  return ' '.repeat(Math.max(0, width - len)) + str;
};

/**
 * Wraps content in a specified HTML tag.
 *
 * @param {string} name The name of the HTML tag.
 * @param {string} content The content to wrap.
 * @returns {string} The HTML tag with the content.
 */
const tag = (name, content) => `<${name}>${content}</${name}>`;

/**
 * Wraps content in a specified HTML tag and bolds it.
 *
 * @param {string} name The name of the HTML tag.
 * @param {string} content The content to wrap and bold.
 * @returns {string} The HTML tag with the bolded content.
 */
const tagBold = (name, content) => `<${name}><bold>${content}</bold></${name}>`;

/**
 * @param {string} txt
 */
const white = (txt) => tag('white', txt);
/**
 * @param {string} txt
 */
const yellow = (txt) => tag('yellow', txt);
/**
 * @param {string} txt
 */
const cyan = (txt) => tag('cyan', txt);
/**
 * @param {string} txt
 */
const green = (txt) => tag('green', txt);
/**
 * @param {string} txt
 */
const red = (txt) => tag('red', txt);
/**
 * @param {string} txt
 */
const magenta = (txt) => tag('magenta', txt);
/**
 * @param {string} txt
 */
const grey = (txt) => tag('grey', txt);

/**
 * @param {string} txt
 */
const whiteBold = (txt) => tagBold('white', txt);
/**
 * @param {string} txt
 */
const yellowBold = (txt) => tagBold('yellow', txt);
/**
 * @param {string} txt
 */
const cyanBold = (txt) => tagBold('cyan', txt);
/**
 * @param {string} txt
 */
const greenBold = (txt) => tagBold('green', txt);
/**
 * @param {string} txt
 */
const redBold = (txt) => tagBold('red', txt);
/**
 * @param {string} txt
 */
const magentaBold = (txt) => tagBold('magenta', txt);
/**
 * @param {string} txt
 */
const greyBold = (txt) => tagBold('grey', txt);

/**
 * @param {string} txt
 */
const blue = (txt) => tag('blue', txt);
/**
 * @param {string} txt
 */
const blueBold = (txt) => tagBold('blue', txt);

/**
 * @param {string} txt
 */
const orange = (txt) => tag('orange', txt);
/**
 * @param {string} txt
 */
const orangeBold = (txt) => tagBold('orange', txt);

/**
 * @param {string} txt
 */
const purple = (txt) => tag('purple', txt);
/**
 * @param {string} txt
 */
const purpleBold = (txt) => tagBold('purple', txt);

/**
 * @param {string} txt
 */
const teal = (txt) => tag('teal', txt);
/**
 * @param {string} txt
 */
const tealBold = (txt) => tagBold('teal', txt);

/**
 * Creates a divider string of a specified character and width.
 *
 * @param {string} [char='-'] The character to use for the divider.
 * @param {number} [width=80] The width of the divider.
 * @returns {string} The divider string.
 */
const divider = (char = '-', width = 80) => char.repeat(width);

/**
 * Prints two columns of text with a specified width for the first column.
 *
 * @param {string} label The text for the first column (label).
 * @param {string} value The text for the second column (value).
 * @param {number} [width=40] The width of the first column.
 * @returns {string} The formatted two-column string.
 */
const printTwoCol = (label, value, width = 40) => {
  const cleanLabel = stripTags(label);
  const pad = ' '.repeat(Math.max(0, width - cleanLabel.length));
  return label + pad + value;
};

/**
 * Prints a section with a title and lines of content, surrounded by dividers.
 *
 * @param {string} title The title of the section.
 * @param {string[]} lines An array of lines for the content.
 * @param {object} [options={}] Optional parameters.
 * @param {number} [options.width=80] The width of the section.
 * @param {boolean} [options.bottom=true] Whether to include a bottom divider.
 * @returns {string} The formatted section string.
 */
const printSection = (title, lines, { width = 80, bottom = true } = {}) => {
  const divider = '-'.repeat(width);
  const decoratedTitle = title
    ? '-'.repeat(Math.floor((width - 3 - title.length - 4) / 2)) +
      ` [ ${title} ] ` +
      '-'.repeat(Math.ceil((width - 3 - title.length - 4) / 2))
    : divider;

  const content = lines.join('\r\n');
  const base = decoratedTitle + '\r\n' + content;
  return whiteBold(bottom ? base + '\r\n' + divider : base + '\r\n');
};

module.exports = {
  center,
  padRight,
  padLeft,
  stripTags,
  divider,
  printSection,
  printTwoCol,
  tag,
  tagBold,
  white,
  yellow,
  cyan,
  green,
  red,
  magenta,
  grey,
  blue,
  orange,
  purple,
  teal,
  whiteBold,
  yellowBold,
  cyanBold,
  greenBold,
  redBold,
  magentaBold,
  greyBold,
  blueBold,
  orangeBold,
  purpleBold,
  tealBold,
};
