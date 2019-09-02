const utils = require('../utils');
const config = require('../config').config;
const redisKey = require('../config').redisKey;

class Candidate {
    /**
     * 改变投票状态，0表示未开始，1表示开始，2表示结束
     * @param {*} status 
     */
    async changeVoteStatus(status) {
        try {
            //当候选人少于两人时不能开始投票
            let candidates = await Model.votes('candidate').find({});
            candidates = JSON.parse(JSON.stringify(candidates));
            if (candidates.length < 2) return { success: false, code: 4001, msg: 'Cannot change the voting status.' };

            if ([0, 1, 2].indexOf(status) == -1) return { success: false, code: 4001, msg: 'Params error' };
            if (status == 0) {
                await utils.redis.del(redisKey.voteStatus);
                return { success: true, msg: 'ok' };
            } 
            await utils.redis.set(redisKey.voteStatus, status);
            return { success: true, msg: 'ok' };
        }
        catch (error) {
            utils.logger.error('changeVoteStatus error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
    }

    /**
     * 获取投票状态
     */
    async getVoteStatus(){
        try {
            let response = await utils.redis.get(redisKey.voteStatus);
            if (!response) response = 0;
            return { success: true, msg: 'ok', data: {status: response} };
        }
        catch (error) {
            utils.logger.error('getVoteStatus error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
        
    }

    /**
     * 添加候选人
     * @param {*} name 
     */
    async add(name) {
        //投票开始后不能再进行操作
        let res = await this.getVoteStatus();
        if (!res.success) return { success: false, code: 4012, msg: 'Database operation exception' };
        if (res.data && res.data.status) return { success: false, code: 4015, msg: 'Voting has started or ended and can no longer operate' };
        
        try {
            let oldName = await Model.votes('candidate').findOne({ name: name })
            if (oldName) return { success: false, code: 4011, msg: 'Username already exists' };
            await Model.votes('candidate').create({ name: name })
            return { success: true, msg: 'ok' };
        }
        catch (error) {
            utils.logger.error('add mongodb error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
    }

    /**
     * 删除候选人
     * @param {*} name 
     */
    async del(name) {
        //投票开始后不能再进行操作
        let res = await this.getVoteStatus();
        if (!res.success) return { success: false, code: 4012, msg: 'Database operation exception' };
        if (res.data.status) return { success: false, code: 4015, msg: 'Voting has started or ended and can no longer operate' };

        try {
            await Model.votes('candidate').deleteOne({ name: name })
            return { success: true, msg: 'ok' };
        }
        catch (error) {
            utils.logger.error('add mongodb error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
    }

    /**
     * 获取候选人列表/实时投票结果
     */
    async list() {
        try {
            let res = await Model.votes('candidate').find({},['id', 'name', 'votes']);
            res = JSON.parse(JSON.stringify(res));
            return { success: true, msg: 'ok', data: res};
        }
        catch (error) {
            utils.logger.error('list mongodb error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
    }
}

module.exports = Candidate;