const Router = require('koa-router');
const User = require('../../models/user');

const router = new Router({
  prefix: '/auth'
});

// 信息验证
router.use('/', async (ctx, next) => {
  const { signed, userId } = ctx.session;
  if (!signed || !userId) {
    ctx.body = {
      status: 0,
      error: '你尚未登录，请登录后再操作'
    };
  }
  const user = await User.getUser({ id: userId });
  if (!user) {
    ctx.body = {
      status: 0,
      error: '你的身份信息有误'
    };
  }
  // 身份信息验证成功
  if (user && signed) {
    await next();
  }
});

router.get('/get_follow_apps', async (ctx, next) => {
  const id = ctx.session.userId;
  const { followAPPs } = await User.getUser({ id });
  ctx.body = {
    apps: followAPPs
  };
  await next();
});

router.post('/follow_app', async (ctx, next) => {
  const id = ctx.session.userId;
  const { app } = ctx.request.body;
  // 获取原关注的应用
  const { followAPPs } = await User.getUser({ id });
  followAPPs.push(app);
  User.updateUserById(id, { followAPPs });
  await next();
});

module.exports = router;
