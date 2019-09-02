/**
 * 登录校验
 */
const utils = require('../utils');
const codes = require('../config').code;
const specialUrls = [
    '/apiDocs',
    '/_api.json',
    '/user/login',
    '/user/register',
    '/worker/changeVoteStatus',
    '/worker/getVoteStatus',
    '/worker/add',
    '/worker/del',
    '/worker/list'
];

module.exports = async (ctx, next) => {
    if (process.env.NODE_ENV != 'production' && (specialUrls.indexOf(ctx.url)!==-1 || ctx.url.match('/user/activateEmail'))) {
        try {
            return await next();
        } catch (error) {
            utils.logger.error(error.message);
            return ctx.response.body = { code: 4000, msg: 'Undefined error information', err: error.message }
        }
    }
    let token = ctx.req.headers.token;
    if (token) {
        let userInfo;
        try {
            userInfo = utils.jwt.verify(token, utils.config.app.jwtSecret, { maxAge: '24h' });
            utils.logger.debug('userInfo', userInfo);
        } catch (error) {
            return ctx.response.body = { code: 4009, msg: 'Login is invalid, please log in again' }
        }

        try {
            if (userInfo) {
                ctx.userInfo = userInfo;
                return await next();
            } else {
                return ctx.response.body = { code: 4009, msg: 'Login is invalid, please log in again' };
            }
        } catch (error) {
            utils.logger.error(error);
            return ctx.response.body = { code: 4000, msg: 'Undefined error information', err: error.message }
        }
    } else {
        return ctx.response.body = { code: 4009, msg: 'Login is invalid, please log in again' };
    }
}