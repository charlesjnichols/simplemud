function centerText(str, width = 80) {
    if (!str || str.length >= width) return str;
  
    const totalPadding = width - str.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
  
    return ' '.repeat(leftPadding) + str + ' '.repeat(rightPadding);
  }
  
  module.exports = { centerText };