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
  // 在数据库中验证用户身份
  const user = await User.getUser({ id: userId });
  if (!user) {
    ctx.body = {
      status: 0,
      expired: 1, // 身份过期
      error: '你的身份信息已过期，请重新登录'
    };
  }
  // 身份信息验证成功
  if (user && signed) {
    await next();
  }
});

router.post('/update_user_info', async (ctx, next) => {
  const id = ctx.session.userId;
  const { username, email } = ctx.request.body;
  const res = username
    ? await User.updateUserName(id, username)
    : await User.updateEmail(id, email);
  if (res) {
    const { email, username, _id } = res;
    ctx.body = {
      account: {
        email,
        username,
        id: _id
      },
      status: 1
    };
  } else {
    ctx.body = {
      error: '更新失败，请重试',
      status: 0
    };
  }
  await next();
});

router.post('/change_password', async (ctx, next) => {
  const id = ctx.session.userId;
  const { newPassword, oldPassword } = ctx.request.body;
  const result = await User.updatePassword(id, oldPassword, newPassword);
  if (result) {
    ctx.body = {
      status: 1
    };
  } else {
    ctx.body = {
      status: 0,
      error: '原始密码错误，请重试'
    };
  }
  await next();
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
  const apps = await User.addUserFollow(id, app);
  ctx.body = {
    apps,
    status: 1
  };
  await next();
});

router.post('/cancel_follow_app', async (ctx, next) => {
  const id = ctx.session.userId;
  const { app } = ctx.request.body;
  const apps = await User.cancelUserFollow(id, app);
  ctx.body = {
    apps,
    status: 1
  };
  await next();
});

router.get('/get_collect_articles', async (ctx, next) => {
  const id = ctx.session.userId;
  const { collectArticles } = await User.getUser({ id });
  // 过滤掉标志为不收藏的文章
  const articles = collectArticles.filter(v => !v.delete);
  ctx.body = {
    articles,
    status: 1
  };
  await next();
});

router.post('/collect_article', async (ctx, next) => {
  const id = ctx.session.userId;
  const { article } = ctx.request.body;
  article.content = null;
  article.summary = article.summary.length < 256 ? article.summary : article.summary.slice(0, 256);
  const res = await User.addCollectArticle(id, article);
  if (res) {
    ctx.body = {
      status: 1
    };
  } else {
    ctx.body = {
      status: 0,
      error: '收藏失败'
    };
  }
  await next();
});

router.post('/cancel_collect_article', async (ctx, next) => {
  const id = ctx.session.userId;
  const { url } = ctx.request.body;
  const res = await User.cancelCollectArticle(id, url);
  if (res) {
    ctx.body = {
      status: 1
    };
  } else {
    ctx.body = {
      status: 0,
      error: '取消收藏失败'
    };
  }
  await next();
});

module.exports = router;
