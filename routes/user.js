/**
 * 用户信息验证
 */

const Router = require('koa-router');
const User = require('../models/user');
const Verification = require('../models/verification');

const { getFormatTime, generateCode } = require('../utils');
const { sendEmail } = require('../utils/email');

const router = new Router({
  prefix: '/user'
});

// 发送验证码
router.post('/send_verification_code', async (ctx, next) => {
  const { email } = ctx.request.body;
  if (email) {
    // 生成随机验证码
    const code = generateCode();
    try {
      await sendEmail(email, code);
      Verification.setCode(code, email);
      ctx.body = {
        status: 1
      };
    } catch (error) {
      ctx.body = {
        error: '发送失败，请检查你的邮箱地址是否正确',
        status: 0
      };
    }
  } else {
    ctx.body = {
      status: 0,
      error: '邮箱不能为空'
    };
  }
  await next();
});

// 注册新用户
router.post('/register', async (ctx, next) => {
  const { username, password, email, code } = ctx.request.body;
  const exit = await User.checkUser(email);
  console.log(code);
  // 无验证码
  if (!code) {
    ctx.body = {
      status: 0,
      error: '验证码不能为空'
    };
    await next();
    return;
  }
  // 邮箱已经存在
  if (exit) {
    ctx.body = {
      status: 0,
      error: '邮箱已被占用'
    };
    await next();
    return;
  }
  // 获取已存储验证码
  const storeCode = await Verification.getCode(email);
  if (code !== storeCode) {
    ctx.body = {
      status: 0,
      error: '验证码错误'
    };
    await next();
    return;
  }
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
  if (users.length) {
    ctx.body = {
      status: 1,
      account: {
        username,
        id: users[0]._id,
        email: users[0].email
      }
    };
    // 写入 session 信息，标志登录成功
    ctx.session.signed = 1;
    ctx.session.userId = users[0]._id;
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
    // 登录成功
    ctx.body = {
      status: 1,
      account: {
        username: user.username,
        email: user.email,
        id: user._id
      }
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
  const user = await User.getUser({ id });
  if (user && signed) {
    ctx.session = null;
  }
  ctx.body = {
    status: 1
  };
  await next();
});

module.exports = router;
