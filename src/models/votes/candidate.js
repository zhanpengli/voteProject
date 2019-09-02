/**
 * 候选人表
 */
module.exports = {
    schema: {
        "name": String,
        "votes": {
            type: Number,
            default: 0,
            comment: '票数'
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
            keys: { name: 1}
        }
    ]
};