/**
 * 用户表
 */
module.exports = {
    schema: {
        "name": String,
        "email": String,
        "password": String,
        "status": { //0代表已注册但未进行邮箱激活，1代表已激活邮箱，2代表禁用状态
            type: Number,
            default: 0,
            comment: '状态'
        },
        "isVote": { //0表示未投票，1表示已投票
            type: Number,
            default: 0,
            comment: '是否已投票'
        },
        "createTime": {
            type: Number,
            default: function () {
                return parseInt(new Date().getTime() / 1000)
            }
        },
        "updateTime": {
            type: Number,
            default: function () {
                return parseInt(new Date().getTime() / 1000)
            }
        }
    },
    indexes: [
        {
            keys: { email: 1}
        }
    ]
};