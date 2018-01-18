const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  });
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
