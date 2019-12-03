const Koa = require('koa');
const api = require('./api');

const app = new Koa();

app.use(api);

const server = app.listen(3001, 'localhost', () => {
  const { address, port } = server.address();
  console.info(`Server listening on http://${address}:${port}`);
});