/* eslint-disable no-control-regex */
const stringWidth = require('string-width');

const wrap = (str, width = 85) => {
  return wrapText(str, width)
    .replace(/((?:\u001b\[\d+m)*)?([^\u001b]+)?([^\r])\n/g, '$1$2$3\r\n$1');
};

const wrapText = (text, width) => {
  const start = 0;
  const stop = width;

  const chunks = text.toString().split(/(\S+\s+)/);

  const wrapped = chunks.reduce((lines, rawChunk) => {
    if (!rawChunk) return lines;

    const chunk = rawChunk.replace(/\t/g, '    ');
    const i = lines.length - 1;
    const currentLine = lines[i];

    if (stringWidth(currentLine) + stringWidth(chunk) > stop) {
      lines[i] = currentLine.replace(/\s+$/, '');

      const splitByNewline = chunk.split(/\n/);
      const newLines = splitByNewline.map((line, index) =>
        (index === 0 ? '' : ' '.repeat(start)) + line.trimStart()
      );
      return [...lines, ...newLines];
    }

    if (chunk.includes('\n')) {
      const splitByNewline = chunk.split(/\n/);
      const [first, ...rest] = splitByNewline;
      lines[i] += first;
      const restLines = rest.map(line => ' '.repeat(start) + line.trimStart());
      return [...lines, ...restLines];
    }

    lines[i] += chunk;
    return lines;
  }, [' '.repeat(start)]);

  return wrapped.join('\n');
};

function parseWord(line, index) {
  if (!line || index < 0) return '';

  const words = line.trim().split(/\s+/);
  return words[index] || '';
}

function removeWord(line, index) {
  if (!line || index < 0) return '';

  const words = line.trim().split(/\s+/);
  words.splice(index, 1);
  return words.join(' ');
}

function tostring(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return String(value);
}

module.exports = { wrap, wrapText, parseWord, removeWord, tostring };
