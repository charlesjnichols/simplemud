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
const tagBold = (name, content) => `<${name}><bold>${content}</bold></${name}>`;

const white = (txt) => tag('white', txt);
const yellow = (txt) => tag('yellow', txt);
const cyan = (txt) => tag('cyan', txt);
const green = (txt) => tag('green', txt);
const red = (txt) => tag('red', txt);
const magenta = (txt) => tag('magenta', txt);
const grey = (txt) => tag('grey', txt);

const whiteBold = (txt) => tagBold('white', txt);
const yellowBold = (txt) => tagBold('yellow', txt);
const cyanBold = (txt) => tagBold('cyan', txt);
const greenBold = (txt) => tagBold('green', txt);
const redBold = (txt) => tagBold('red', txt);
const magentaBold = (txt) => tagBold('magenta', txt);
const greyBold = (txt) => tagBold('grey', txt);

const blue = (txt) => tag('blue', txt);
const blueBold = (txt) => tagBold('blue', txt);

const orange = (txt) => tag('orange', txt);
const orangeBold = (txt) => tagBold('orange', txt);

const purple = (txt) => tag('purple', txt);
const purpleBold = (txt) => tagBold('purple', txt);

const teal = (txt) => tag('teal', txt);
const tealBold = (txt) => tagBold('teal', txt);

const brightRed = (txt) => tag('brightRed', txt);
const brightRedBold = (txt) => tagBold('brightRed', txt);

const brightGreen = (txt) => tag('brightGreen', txt);
const brightGreenBold = (txt) => tagBold('brightGreen', txt);

const brightYellow = (txt) => tag('brightYellow', txt);
const brightYellowBold = (txt) => tagBold('brightYellow', txt);

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
  brightRed,
  brightRedBold,
  brightGreen,
  brightGreenBold,
  brightYellow,
  brightYellowBold,
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
