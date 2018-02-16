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
      error: '你的身份信息有误，请重新登录'
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
  // 过滤掉标志为不关注的应用
  const apps = followAPPs.filter(v => !v.delete);
  ctx.body = {
    apps,
    status: 1
  };
  await next();
});

router.post('/follow_app', async (ctx, next) => {
  const id = ctx.session.userId;
  const { app } = ctx.request.body;
  // 获取原关注的应用
  const res = await User.addUserFollow(id, app);
  if (res) {
    ctx.body = {
      status: 1
    };
  } else {
    ctx.body = {
      status: 0,
      error: '更新失败'
    };
  }
  await next();
});

router.post('/cancel_follow_app', async (ctx, next) => {
  const id = ctx.session.userId;
  const { app } = ctx.request.body;
  const res = await User.cancelUserFollow(id, app);
  console.log(res);
  if (res) {
    ctx.body = {
      status: 1
    };
  } else {
    ctx.body = {
      status: 0,
      error: '取消关注失败'
    };
  }
  await next();
});

module.exports = router;
