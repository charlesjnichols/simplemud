/**
 * @module src/utils/strings.js
 *
 * Utility functions for string manipulation.
 */

const stringWidth = require('string-width');

/**
 * Wraps a string to a specified width, adding line breaks as needed.
 *
 * @param {string} str The string to wrap.
 * @param {number} [width=85] The maximum width of each line.
 * @returns {string} The wrapped string.
 */
const wrap = (str, width = 85) => {
  // eslint-disable-next-line no-control-regex
  return wrapText(str, width).replace(/((?:\u001b\[\d+m)*)?([^\u001b]+)?([^\r])\n/g, '$1$2$3\r\n$1');
};

/**
 * Wraps text to a specified width, splitting into lines.
 *
 * @param {string} text The text to wrap.
 * @param {number} width The maximum width of each line.
 * @returns {string} The wrapped text.
 */
const wrapText = (text, width) => {
  const start = 0;
  const stop = width;

  const chunks = text.toString().split(/(\S+\s+)/);

  const wrapped = chunks.reduce(
    (lines, rawChunk) => {
      if (!rawChunk) return lines;

      const chunk = rawChunk.replace(/\t/g, '    ');
      const i = lines.length - 1;
      const currentLine = lines[i];

      if (stringWidth(currentLine) + stringWidth(chunk) > stop) {
        lines[i] = currentLine.replace(/\s+$/, '');

        const splitByNewline = chunk.split(/\n/);
        const newLines = splitByNewline.map((line, index) => (index === 0 ? '' : ' '.repeat(start)) + line.trimStart());
        return [...lines, ...newLines];
      }

      if (chunk.includes('\n')) {
        const splitByNewline = chunk.split(/\n/);
        const [first, ...rest] = splitByNewline;
        lines[i] += first;
        const restLines = rest.map((line) => ' '.repeat(start) + line.trimStart());
        return [...lines, ...restLines];
      }

      lines[i] += chunk;
      return lines;
    },
    [' '.repeat(start)],
  );

  return wrapped.join('\n');
};

/**
 * Parses a word from a line at a given index.
 *
 * @param {string} line The line to parse.
 * @param {number} index The index of the word to retrieve.
 * @returns {string} The word at the specified index, or an empty string if not found.
 */
function parseWord(line, index) {
  if (!line || index < 0) return '';

  const words = line.trim().split(/\s+/);
  return words[index] || '';
}

/**
 * Removes a word from a line at a given index.
 *
 * @param {string} line The line to modify.
 * @param {number} index The index of the word to remove.
 * @returns {string} The line with the word removed.
 */
function removeWord(line, index) {
  if (!line || index < 0) return '';

  const words = line.trim().split(/\s+/);
  words.splice(index, 1);
  return words.join(' ');
}

/**
 * Converts a value to a string representation.
 *
 * @param {*} value The value to convert.
 * @returns {string} The string representation of the value.
 */
function tostring(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return String(value);
}

module.exports = { wrap, wrapText, parseWord, removeWord, tostring };
