/**
 * 不需要验证即可获得的信息
 */

const Router = require('koa-router');
const apps = require('../api');
const {
  getCategories, getAPPArticleList, getAPPArticle
} = require('../api/app');

const router = new Router();

router.get('/get_menu', async (ctx, next) => {
  const { app } = ctx.query;
  if (!apps[app]) {
    ctx.body = [];
  } else {
    const menu = await apps[app].getMenu();
    ctx.body = JSON.stringify(menu);
  }
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
  const data = await getAPPArticleList(section, id);
  ctx.body = JSON.stringify(data);
  await next();
});

router.get('/get_app_article', async (ctx, next) => {
  const { url, section, hasRss } = ctx.query;
  const data = await getAPPArticle(url, section, hasRss);
  ctx.body = JSON.stringify(data);
  await next();
});

module.exports = router;
