/**
 * 不需要验证即可获得的信息
 */

const Router = require('koa-router');
const { getCategories, getMenu, getArticleList, getArticle } = require('../api');

const router = new Router();

router.get('/get_categories', async (ctx, next) => {
  const data = await getCategories();
  ctx.body = JSON.stringify(data);
  await next();
});

router.get('/get_menu', async (ctx, next) => {
  const { type, appId } = ctx.query;
  const menu = await getMenu(type, appId);
  ctx.body = JSON.stringify(menu);
  await next();
});

router.get('/get_article_list', async (ctx, next) => {
  const { type, appId, column, id, page } = ctx.query;
  try {
    const list = await getArticleList(type, appId, column, id, page);
    ctx.body = {
      status: 1,
      articleList: list
    };
  } catch (error) {
    ctx.body = {
      status: 0,
      error: error.message
    };
  }
  await next();
});

router.get('/get_article', async (ctx, next) => {
  const { type, appId, article } = ctx.query;
  try {
    const res = await getArticle(type, appId, JSON.parse(article));
    ctx.body = {
      article: res,
      status: 1
    };
  } catch (error) {
    ctx.body = {
      error: error.message,
      status: 0
    };
  }
  await next();
});

module.exports = router;
