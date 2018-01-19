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

module.exports = {
  writeFile
};
