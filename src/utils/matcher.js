function compName(name) {
  return name.toLowerCase();
}

function matchFull(name, str) {
  return compName(name) === str.toLowerCase();
}

function matchPartial(name, str) {
  const nameLower = compName(name);
  const search = str.toLowerCase();

  return checkMatch(nameLower, search, 0);
}

function checkMatch(name, search, index) {
  if (index === -1) return false;

  if (index === 0 || name[index - 1] === ' ') return true;

  return checkMatch(name, search, name.indexOf(search, index + 1));
}

module.exports = {
  matchFull,
  matchPartial,
};
