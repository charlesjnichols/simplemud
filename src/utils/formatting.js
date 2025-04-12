function center(str, width = 80) {
  const len = stripTags(str).length;
  if (len >= width) return str;

  const pad = width - len;
  const left = Math.floor(pad / 2);
  const right = pad - left;

  return ' '.repeat(left) + str + ' '.repeat(right);
}

function padRight(str, width) {
  const len = stripTags(str).length;
  return str + ' '.repeat(Math.max(0, width - len));
}

function padLeft(str, width) {
  const len = stripTags(str).length;
  return ' '.repeat(Math.max(0, width - len)) + str;
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, '');
}

function tag(name, content) {
  return `<${name}>${content}</${name}>`;
}

const format = {
  white: (txt) => tag('white', txt),
  yellow: (txt) => tag('yellow', txt),
  cyan: (txt) => tag('cyan', txt),
  green: (txt) => tag('green', txt),
  whiteBold: (txt) => `<white><bold>${txt}</bold></white>`,

  center,
  padRight,
  padLeft,
  stripTags
};

module.exports = format;
