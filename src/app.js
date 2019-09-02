const Koa = require('koa'),
    logger = require('koa-logger'),
    json = require('koa-json'),
    onerror = require('koa-onerror'),
    cors = require('@koa/cors'),
    Router = require('koa-joi-router'),
    SwaggerAPI = require('koa-joi-router-docs').SwaggerAPI
const _logger = require('./utils/logger');
const config = require('./config').config;
const routers = require('./routes');
const middleware = require('./middleware');
const Models = require('./models');
global.Model = {};

const app = new Koa();
onerror(app);
app.use(json());
app.use(logger());
app.use(cors());
app.use(async (ctx, next) => {
    let start = new Date;
    let ms = new Date - start;
    _logger.info('%s %s', ctx.method, ctx.url);
    await next();
    _logger.info('time: ', ms);
})

const router = Router();
router.route(routers);
const generator = new SwaggerAPI();
generator.addJoiRouter(router);

const spec = generator.generateSpec({
    info: {
        title: '投票系统 API文档',
        description: 'voteProject',
        version: '0.0.1'
    },
    basePath: '/',
    tags: [{
        name: 'voteProject',
        title: '投票系统 API文档',
        description: '投票系统'
    }],
}, {
    defaultResponses: {} // Custom default responses if you don't like default 200
})

/**
 * Swagger JSON API
 */
router.get('/_api.json', async ctx => {
    ctx.body = JSON.stringify(spec, null, '  ')
})


/**
 * API documentation
 */
router.get('/apiDocs', async ctx => {
    ctx.body = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Example API</title>
  </head>
  <body>
    <redoc spec-url='/_api.json' lazy-rendering></redoc>
    <script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"></script>
  </body>
  </html>`
})

const server = app.listen(config.app.port).on('error', () => {
    console.error(`未能监听到${config.app.port}端口`)
})
console.log(`监听端口：${config.app.port}`);
process.on('uncaughtException', (err) => {
    console.error(err.stack);
})

//连接数据库
Model.votes = Models.createDb(config.voteProjectDb);

//权限校验
app.use(middleware.access);

//路由
app.use(router.middleware())

module.exports = server;