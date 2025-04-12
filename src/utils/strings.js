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
  
  module.exports = { parseWord, removeWord, tostring };
  