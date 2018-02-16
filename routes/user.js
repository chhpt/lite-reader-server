/**
 * 用户信息验证
 */

const Router = require('koa-router');
const User = require('../models/user');
const { getFormatTime } = require('../utils');

const router = new Router({
  prefix: '/user'
});

// 注册新用户
router.post('/register', async (ctx, next) => {
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
    const { ip } = ctx;
    const user = {
      username,
      password,
      email,
      registerTime,
      ips: [ip]
    };
    // 注册成功
    const users = await User.insertUser(user);
    const status = users.length ? 1 : 0;
    ctx.body = {
      status,
      id: users[0]._id,
      email: users[0].email
    };
  }
  await next();
});

// 通过 email 登录
router.post('/login', async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const user = await User.getUser({ email });
  // 用户不存在
  if (!user) {
    ctx.body = {
      status: 0,
      error: '邮箱不存在'
    };
  } else if (user.password !== password) {
    ctx.body = {
      status: 0,
      error: '密码错误'
    };
  } else {
    ctx.body = {
      status: 1,
      username: user.username,
      email: user.email,
      id: user._id
    };
    // 写入 session 信息，标志登录成功
    ctx.session.signed = 1;
    ctx.session.userId = user._id;
  }
  await next();
});

router.post('/logout', async (ctx, next) => {
  const signed = ctx.session.signed;
  const id = ctx.session.userId;
  const user = User.getUser({ id });
  if (user && signed) {
    ctx.session = null;
    ctx.body.status = 1;
  } else {
    ctx.body = {
      status: 0,
      error: '注销失败，身份信息有误'
    };
  }
  await next();
});

module.exports = router;
