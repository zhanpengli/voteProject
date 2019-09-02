const servers = require('../servers');
const candidateServer = new servers.Candidate();
const utils = require('../utils');
const Common = require('./common');

class CandidateCtrl {
    async changeVoteStatus(ctx, next) {
        let { status } = ctx.request.body;
        let res = await candidateServer.changeVoteStatus(status);
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }

    async getVoteStatus(ctx, next) {
        let res = await candidateServer.getVoteStatus();
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }

    async add(ctx, next) {
        let { name } = ctx.request.body;
        let res = await candidateServer.add(name);
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }

    async del(ctx, next) {
        let { name } = ctx.request.body;
        let res = await candidateServer.del(name);
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }

    async list(ctx, next) {
        let res = await candidateServer.list();
        utils.logger.debug('res', res);
        return Common.setResponse(ctx, res);
    }
}

module.exports = new CandidateCtrl();