const { ERROR_CODES } = require('../../config');

exports.handler = async (ctx, next) => {
  try {
    ctx.status = 200;
    await next();
  } catch (err) {
    console.error(`[${ctx.method}] ${ctx.url}`);
    console.error(err);
    if (err.isJoi) {
      ctx.status = 400;
      [ctx.body] = err.details;
    } else {
      ctx.status = ERROR_CODES[err.message] || 500;
      ctx.body = { message: err.message };
    }
  }
};

exports.missed = ctx => {
  ctx.throw(404, 'API call not found!');
};