/**
 * 用户操作相关的路由配置
 */
const Router = require('koa-joi-router');
const Joi = Router.Joi;
const controller = require('../controller').candidate;

module.exports = [
    {
        meta: {
            swagger: {
                summary: '改变投票状态',
                description: '需要状态值',
                tags: ['worker']
            }
        },
        method: 'post',
        path: '/worker/changeVoteStatus',
        validate: {
            body: {
                status: Joi.number().description('状态值').required(),
            },
            output: {
                200: {
                    body: {
                        msg: Joi.any().optional(),
                        code: Joi.any().optional()
                    }
                }
            },
            type: 'json'
        },
        handler: controller.changeVoteStatus
    },
    {
        meta: {
            swagger: {
                summary: '获取投票状态',
                description: '获取投票状态',
                tags: ['worker']
            }
        },
        method: 'get',
        path: '/worker/getVoteStatus',
        validate: {
            output: {
                200: {
                    body: {
                        msg: Joi.any().optional(),
                        code: Joi.any().optional(),
                        data: Joi.object().keys({
                            status: Joi.number().optional().description("投票状态，0表示未开始，1表示已开始，2表示已结束")
                        })
                    }
                }
            }
        },
        handler: controller.getVoteStatus
    },
    {
        meta: {
            swagger: {
                summary: '增加候选人',
                description: '需要候选人名称,候选人名字是唯一的',
                tags: ['worker']
            }
        },
        method: 'post',
        path: '/worker/add',
        validate: {
            body: {
                name: Joi.string().description('候选人名字').required(),
            },
            output: {
                200: {
                    body: {
                        msg: Joi.any().optional(),
                        code: Joi.any().optional()
                    }
                }
            },
            type: 'json'
        },
        handler: controller.add
    },
    {
        meta: {
            swagger: {
                summary: '删除候选人',
                description: '需要候选人名称',
                tags: ['worker']
            }
        },
        method: 'post',
        path: '/worker/del',
        validate: {
            body: {
                name: Joi.string().description('候选人名字').required(),
            },
            output: {
                200: {
                    body: {
                        msg: Joi.any().optional(),
                        code: Joi.any().optional()
                    }
                }
            },
            type: 'json'
        },
        handler: controller.del
    },
    {
        meta: {
            swagger: {
                summary: '获取实时投票结果',
                description: '获取实时投票结果',
                tags: ['worker']
            }
        },
        method: 'get',
        path: '/worker/list',
        validate: {
            output: {
                200: {
                    body: {
                        msg: Joi.any().optional(),
                        code: Joi.any().optional(),
                        data: Joi.array().items({
                            _id: Joi.string().optional().description("数据库id"),
                            name: Joi.string().optional().description("候选人"),
                            votes: Joi.number().optional().description("票数"),
                        })
                    }
                }
            }
        },
        handler: controller.list
    },
]