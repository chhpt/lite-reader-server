const Router = require('koa-router');
const User = require('../models/user');
const { getFormatTime, generateUUID } = require('../utils');

const router = new Router();

// 注册新用户
router.post('/user_register', async (ctx, next) => {
  const { username, password, email } = ctx.request.body;
  const exit = await User.checkUser(email);
  // 邮箱已经存在
  if (exit) {
    ctx.body = {
      status: 0,
      error: '邮箱已被占用'
    };
  } else {
    const registerTime = getFormatTime();
    const user = {
      username,
      password,
      email,
      registerTime,
      id: generateUUID(),
      ips: []
    };
    // 注册成功
    const success = await User.insertUser(user);
    ctx.body.status = success ? 1 : 0;
  }
  await next();
});

// 通过 email 登录
router.post('/user_login', async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const users = await User.getUser(email);
  if (!users.length) {
    ctx.body = {
      status: 0,
      error: '邮箱不存在'
    };
  } else if (users.length === 1) {
    const user = users[0];
    if (user.password === password) {
      ctx.body.status = 1;
    }
  }
  await next();
});

module.exports = router;
