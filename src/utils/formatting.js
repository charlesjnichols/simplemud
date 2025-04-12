const stripTags = (str) => str.replace(/<[^>]+>/g, '');

const center = (str, width = 80) => {
  const len = stripTags(str).length;
  if (len >= width) return str;
  const pad = width - len;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + str + ' '.repeat(right);
};

const padRight = (str, width) => {
  const len = stripTags(str).length;
  return str + ' '.repeat(Math.max(0, width - len));
};

const padLeft = (str, width) => {
  const len = stripTags(str).length;
  return ' '.repeat(Math.max(0, width - len)) + str;
};

const tag = (name, content) => `<${name}>${content}</${name}>`;

const white = (txt) => tag('white', txt);
const yellow = (txt) => tag('yellow', txt);
const cyan = (txt) => tag('cyan', txt);
const green = (txt) => tag('green', txt);
const red = (txt) => tag('red', txt);
const whiteBold = (txt) => `<white><bold>${txt}</bold></white>`;
const redBold = (txt) => `<red><bold>${txt}</bold></red>`;
const cyanBold = (txt) => `<cyan><bold>${txt}</bold></cyan>`;
const magentaBold = (txt) => `<magenta><bold>${txt}</bold></magenta>`;
const greenBold = (txt) => `<green><bold>${txt}</bold></green>`;
const yellowBold = (txt) => `<yellow><bold>${txt}</bold></yellow>`;

const divider = (char = '-', width = 80) => char.repeat(width);

const printTwoCol = (label, value, width = 40) => {
  const cleanLabel = stripTags(label);
  const pad = ' '.repeat(Math.max(0, width - cleanLabel.length));
  return label + pad + value;
};

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
  white,
  yellow,
  cyan,
  red,
  green,
  whiteBold,
  redBold,
  cyanBold,
  magentaBold,
  greenBold,
  yellowBold,
  divider,
  printSection,
  printTwoCol,
};
