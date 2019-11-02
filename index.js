const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

router.get('/', (ctx, next) => {
  ctx.body = 'hello Router'
});

router.post('/', (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = 'post'
});

router.put('/', (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = 'put'
});

router.delete('/', (ctx, next) => {
  console.log(ctx.request.body)
  ctx.throw(400, '400 error')
  ctx.body = 'delete'
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => console.log('koa start!'))