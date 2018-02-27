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

const generateCode = () => {
  const code = parseInt(Math.random().toFixed(7) * 1000000, 10).toString();
  return code.length === 6 ? code : code.concat('000000'.slice(0, 6 - code.length));
};

module.exports = {
  writeFile,
  getFormatTime,
  generateUUID,
  generateCode
};
