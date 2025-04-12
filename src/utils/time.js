function createTimer() {
    const start = Date.now();
    return {
      getMS: () => Date.now() - start,
      reset: () => createTimer()
    };
  }
  
  function dateStamp() {
    const d = new Date();
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  function timeStamp() {
    const d = new Date();
    return d.toTimeString().split(' ')[0]; // HH:MM:SS
  }
  
  function upTime() {
    const seconds = Math.floor(process.uptime());
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }

  function seconds(sec) {
    return sec * 1000;
  }

  function minutes(min) {
    return min * 60000;
  }
  
  module.exports = { createTimer, dateStamp, timeStamp, upTime, seconds, minutes };
  