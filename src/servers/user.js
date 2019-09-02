const utils = require('../utils');
const config = require('../config').config;
const redisKey = require('../config').redisKey;

class User {
    /**
     * 用户注册
     * @param {*} name 
     * @param {*} password 
     * @param {*} email 
     */
    async register(name, password, email) {
        let oldEmail, oldName;
        try{
            oldEmail = await Model.votes('user').findOne({ email: email });
            oldName = await Model.votes('user').findOne({ name: name });
        }
        catch(error){
            utils.logger.error('register 数据库查询异常：', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
        
        //检查邮箱和用户名是否已注册
        if (oldEmail) return { success: false, code: 4010, msg: 'The mailbox has been registered' };
        if (oldName) return { success: false, code: 4011, msg: 'Username already exists' };

        //验证邮箱合法性
        let res1 = await utils.emailHelper.emailCheck(email);
        if(!res1) return { success: false, code: 4014, msg: 'The mailbox is illegal' };

        //发送邮箱激活链接
        let res2 = await utils.emailHelper.sendEmail(email);
        if(!res2) return { success: false, code: 4013, msg: 'Mail sent abnormally' };

        //对密码进行md5加密
        password = utils.md5(email + password);
        let tokenInfo = {
            name: name,
            password: password,
            email: email
        }
        //生成JWT令牌
        let token = utils.jwt.sign( tokenInfo, config.app.jwtSecret, { expiresIn: '12h' } );

        try{
            await Model.votes('user').create({
                name: name,
                password: password,
                email: email
            })
        }
        catch(error){
            utils.logger.error('register 数据库create异常：', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }

        return { success: true, msg: '创建成功', data: {token: token}};
    }

    /**
     * 登录
     * @param {*} email 
     * @param {*} password 
     */
    async login(email, password) {
        let user;
        try {
            user = await Model.votes('user').findOne({ email: email });
            utils.logger.debug('user--', user);
            user = JSON.parse(JSON.stringify(user));
        }
        catch (error) {
            utils.logger.error('candidateList mongodb find error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }

        password = utils.md5(email + password);
        if (user && user.password == password) {
            let tokenInfo = {
                name: user.name,
                password: password,
                email: email
            }
            let token = utils.jwt.sign(tokenInfo, config.app.jwtSecret, { expiresIn: '12h' });
            return { success: true, data: { token: token, email: email, name: user.name }, msg: '登录成功'};
        }
        return {success: false, code: 4020, msg: 'Login failed, wrong email name or password'};
    }


    /**
     * 获取候选人列表
     */
    async candidateList() {
        try {
            let res = await Model.votes('candidate').find({},['id', 'name']);
            res = JSON.parse(JSON.stringify(res));
            return { success: true, msg: 'ok', data: res};
        }
        catch (error) {
            utils.logger.error('candidateList mongodb error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
    }

    /**
     * 投票
     * @param {*} email 
     * @param {*} param
     */
    async vote(email, param) {
        try {
            //加锁防止多个用户同时操作投票
            let voteFlag = await utils.redis.get(redisKey.voteFlag);
            if (voteFlag) return { success: false, code: 4016, msg: 'Voting is busy, please try again later' };
            await utils.redis.set(redisKey.voteFlag, 1);

            //判断投票是否开始
            let res1 = await utils.redis.get(redisKey.voteStatus);
            if (!res1) return { success: false, code: 4016, msg: 'Voting has not started and cannot be operated' };
            if (res1 == '2') return { success: false, code: 4017, msg: 'Voting is over started and cannot be operated' };
        }
        catch (error) {
            //如出现异常，给锁设置生命周期
            await utils.redis.expire(redisKey.voteFlag, 5);
            utils.logger.error('user vote redis error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }

        try {
            //判断用户邮箱是否激活和重复投票
            let res2 = await Model.votes('user').findOne({ email: email }, ['name', 'status', 'isVote']);
            res2 = JSON.parse(JSON.stringify(res2));
            if (res2.status == 0) return { success: false, code: 4018, msg: 'Mailbox is not activated' };
            if (res2.isVote == 1) return { success: false, code: 4019, msg: "Can't vote again" };
        }
        catch (error) {
            await utils.redis.expire(redisKey.voteFlag, 5);
            utils.logger.error('user vote mongodb find error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }

        let votesNum = 0;
        param.forEach(e => {
            votesNum += e.votes;
        })

        //判断投用户所投总票数是否大于2并小于5
        if (votesNum < 2 || votesNum > 5) return { success: false, code: 4021, 
            msg: 'Please re-select, the number of votes is two or more and cannot exceed five' };

        try {
            let candidates = await Model.votes('candidate').find({});
            candidates = JSON.parse(JSON.stringify(candidates));
            let candidateNum = candidates.length;
            if (2 < candidateNum < 10) {
                //用户所投总票数不能超过候选人总数一半
                if (votesNum > (candidateNum / 2)) return { success: false, code: 4012, 
                    msg: 'The number of votes cannot exceed half of the number of candidates' }
            }

            //批量更新
            let updateOptions = [];
            param.forEach(e => {
                let arr = utils._.filter(candidates, function(o) {return o.name == e.name});
                updateOptions.push({
                    updateOne: {
                        filter: {
                            name : e.name
                        },
                        update: {
                            $set: {
                                'votes': e.votes + (arr[0] && arr[0].votes ? arr[0].votes : 0)
                            }
                        }
                    }
                })
            })
            await Model.votes('candidate').bulkWrite(updateOptions);
        }
        catch (error) {
            await utils.redis.expire(redisKey.voteFlag, 5);
            utils.logger.error('user vote mongodb find/bulkWrite error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }

        try {
            await utils.redis.del(redisKey.voteFlag);
            await Model.votes('user').update({ email: email }, {$set: { isVote: 1 }});
            return { success: 200, msg: 'ok' };
        }
        catch (error) {
            await utils.redis.expire(redisKey.voteFlag, 5);
            utils.logger.error('user vote mongodb_update/redis_del error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
    }

    /**
     * 激活邮箱
     * @param {*} email 
     */
    async activateEmail(email) {
        try {
            await Model.votes('user').findOneAndUpdate({ email: email }, { status: 1 });
            return { success: true, msg: 'ok'}
        }
        catch (error) {
            utils.logger.error('activateEmail error: ', error.message);
            return { success: false, code: 4012, msg: 'Database operation exception' };
        }
    }
}

module.exports = User;