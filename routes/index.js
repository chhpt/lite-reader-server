const Router = require('koa-router');
const apps = require('../api');
const { appList } = require('../api/app');

const router = new Router();

router.get('/get_app_list', async (ctx, next) => {
  ctx.body = JSON.stringify(appList);
  await next();
});

router.get('/get_menu', async (ctx, next) => {
  const { app } = ctx.query;
  const menu = await apps[app].getMenu();
  ctx.body = JSON.stringify(menu);
  await next();
});

router.get('/articles', async (ctx, next) => {
  const {
    app, page, column, url, id
  } = ctx.query;
  const data = await apps[app].getArticleList(Number(page), column, url, id);
  console.log(data);
  ctx.body = JSON.stringify(data);
  await next();
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string';
  await next();
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  };
  await next();
});

module.exports = router;
