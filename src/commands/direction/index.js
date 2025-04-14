const directions = [
  { keys: ['n', 'north'], file: './direction/north.js' },
  { keys: ['s', 'south'], file: './direction/south.js' },
  { keys: ['e', 'east'], file: './direction/east.js' },
  { keys: ['w', 'west'], file: './direction/west.js' },
];

const directionMap = directions.reduce((acc, { keys, file }) => {
  keys.forEach((k) => {
    acc[k] = file;
  });
  return acc;
}, {});

module.exports = {
  isDirection: (verb) => Object.prototype.hasOwnProperty.call(directionMap, verb),
  getDirectionCommandFile: (verb) => directionMap[verb],
};
