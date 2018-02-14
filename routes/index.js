const APP = require('./app');
const User = require('./user');
const Auth = require('./v1/app');

module.exports = (app) => {
  app.use(APP.routes(), APP.allowedMethods());
  app.use(User.routes(), User.allowedMethods());
  app.use(Auth.routes(), Auth.allowedMethods());
};
