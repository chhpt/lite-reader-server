const APP = require('./app');
const User = require('./user');
const Auth = require('./v1/auth_user');

module.exports = (app) => {
  // 处理 OPTIONS 请求
  app.use(async (ctx, next) => {
    if (ctx.request.method === 'OPTIONS') {
      ctx.response.status = 200;
    }
    await next();
  });
  app.use(APP.routes(), APP.allowedMethods());
  app.use(User.routes(), User.allowedMethods());
  app.use(Auth.routes(), Auth.allowedMethods());
};
