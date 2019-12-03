const Router = require('koa-router');
const compose = require('koa-compose');
const mount = require('koa-mount');
const body = require('koa-body');
const cors = require('koa2-cors');
const { handler, missed } = require('./middlewares/errors');

const balance = require('./routes/balance');
const transactions = require('./routes/transactions');

const router = new Router();

router.use(cors());
router.use(body());
router.use(balance.routes());
router.use(transactions.routes());

module.exports = mount('/api', compose([
  handler,
  router.routes(),
  router.allowedMethods(),
  missed
]));
