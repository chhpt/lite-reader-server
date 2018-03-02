const Koa = require('koa');

const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-session');

const config = require('./config');
const SessionStore = require('./models/session.js');

const Router = require('./routes/index');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));

app.use(json());
app.use(logger());

// session
// session 加密
app.keys = ['session key', 'key'];
app.use(session({ ...config.session, store: SessionStore }, app));

app.use(require('koa-static')(`${__dirname}/public`));

app.use(async (ctx, next) => {
  await next();
  // 允许跨域
  ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
  ctx.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  ctx.set(
    'Access-Control-Allow-Headers',
    'Referer, Accept, Origin, User-Agent, X-Requested-With, Content-Type, withCredentials'
  );
  ctx.set('Access-Control-Allow-Methods', 'HEAD, OPTIONS, GET, POST, DELETE, PUT');
  ctx.set('Access-Control-Allow-Credentials', true);
});

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${start.toLocaleString()} - ${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
Router(app);

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
