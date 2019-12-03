const Router = require('koa-router');

const account = require('../../services/account');

const router = new Router({ prefix: '/balance' });

router.get('/', async ctx => {
  ctx.body = await account.getState(ctx.request.body);
});

module.exports = router;