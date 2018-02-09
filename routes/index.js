const Router = require('koa-router');
const apps = require('../api');
const { appList, getCategories, getAppArticleList } = require('../api/app');

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

router.get('/get_article_list', async (ctx, next) => {
  const {
    app, page, column, url, id
  } = ctx.query;
  const data = await apps[app].getArticleList(Number(page), column, url, id);
  ctx.body = JSON.stringify(data);
  await next();
});

router.get('/get_article', async (ctx, next) => {
  const {
    app, url, payload
  } = ctx.query;
  const data = await apps[app].getArticle(url, JSON.parse(payload));
  ctx.body = JSON.stringify(data);
  await next();
});

router.get('/get_categories', async (ctx, next) => {
  const data = await getCategories();
  ctx.body = JSON.stringify(data);
  await next();
});

router.get('/get_app_article_list', async (ctx, next) => {
  const { id, section } = ctx.query;
  console.log(id, section);
  const data = await getAppArticleList(section, id);
  ctx.body = JSON.stringify(data);
  await next();
});

module.exports = router;
