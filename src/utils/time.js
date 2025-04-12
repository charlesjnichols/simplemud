'use strict';

// Time
const timeStamp = () => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:` +
         `${String(date.getMinutes()).padStart(2, '0')}:` +
         `${String(date.getSeconds()).padStart(2, '0')}`;
};

const dateStamp = () => {
  const date = new Date();
  return `${date.getFullYear()}.` +
         `${String(date.getMonth() + 1).padStart(2, '0')}.` +
         `${String(date.getDate()).padStart(2, '0')}`;
};

const upTime = (secNum = process.uptime()) => {
  const min = Math.floor(secNum / 60) % 60;
  const hour = Math.floor(secNum / 3600) % 24;
  const day = Math.floor(secNum / 86400) % 365;
  const year = Math.floor(secNum / (365 * 86400));

  return [
    [year, 'year'],
    [day, 'day'],
    [hour, 'hour'],
    [min, 'minute']
  ]
    .filter(([val]) => val > 0)
    .map(([val, label]) => `${val} ${label}${val !== 1 ? 's' : ''}`)
    .join(', ');
};

// Time utils
const getTimeMS = () => Date.now();
const seconds = (sec) => sec * 1000;
const minutes = (min) => min * 60000;

// Timer factory
const createTimer = () => {
  const startTime = { current: 0 };
  const initTime = { current: 0 };

  return {
    init: () => {
      startTime.current = 0;
      initTime.current = 0;
      return this;
    },
    reset: (timePassed = 0) => {
      startTime.current = timePassed;
      initTime.current = getTimeMS();
    },
    getMS: () => {
      return (getTimeMS() - initTime.current) + startTime.current;
    }
  };
};

module.exports = {
  timeStamp,
  dateStamp,
  upTime,
  getTimeMS,
  seconds,
  minutes,
  createTimer
};
