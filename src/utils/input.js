function resolveInput(input, options) {
  input = input.toLowerCase().trim();

  if (options[input]) return options[input];

  const values = Object.values(options);
  const matches = values.filter((value) => value.startsWith(input));
  const unique = [...new Set(matches)];

  if (unique.length === 1) return unique[0];
  if (unique.length > 1) return 'AMBIGUOUS';

  return null;
}

module.exports = { resolveInput };
