const APP = require('./app');
const User = require('./user');


module.exports = (app) => {
  app.use(APP.routes(), APP.allowedMethods());
  app.use(User.routes(), User.allowedMethods());
};
