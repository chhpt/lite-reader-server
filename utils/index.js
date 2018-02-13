const fs = require('fs');
// const path = require('path');

const writeFile = (path, content) => {
  fs.writeFile(`${__dirname}/${path}`, content, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
    }
  });
};

const getFormatTime = () => new Date().toLocaleString();

const generateUUID = () => {
  const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
  return id;
};

module.exports = {
  writeFile,
  getFormatTime,
  generateUUID
};
