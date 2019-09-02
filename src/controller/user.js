const servers = require('../servers');
const userServer = new servers.User();
const utils = require('../utils');
const Common = require('./common');

class UserCtrl {
    async register(ctx, next) {
        let { name, password, email } = ctx.request.body;
        let res = await userServer.register(name, password, email);
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }

    async login(ctx, next) {
        let { email, password } = ctx.request.body;
        let res = await userServer.login(email, password);
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }

    async candidateList(ctx, next) {
        let res = await userServer.candidateList();
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }

    async vote(ctx, next) {
        let { email, data } = ctx.request.body;
        let res = await userServer.vote(email, data);
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }

    async activateEmail(ctx, next) {
        let { email } = ctx.request.query;
        let res = await userServer.activateEmail(email);
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }
}

module.exports = new UserCtrl();