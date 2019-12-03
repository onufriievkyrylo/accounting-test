const Router = require('koa-router');

const account = require('../../services/account');

const router = new Router({ prefix: '/transactions' });

router.get('/', async ctx => {
  ctx.body = await account.getTransactions(ctx.request.query);
});

router.get('/:transactionId', async ctx => {
  ctx.body = await account.getTransaction(ctx.params.transactionId);
});

router.post('/', async ctx => {
  ctx.body = await account.createTransaction(ctx.request.body);
});

module.exports = router;