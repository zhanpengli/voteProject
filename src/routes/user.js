/**
 * 用户操作相关的路由配置
 */
const Router = require('koa-joi-router');
const Joi = Router.Joi;
const controller = require('../controller').user;

module.exports = [
    {
        meta: {
            swagger: {
                summary: '用户注册',
                description: '需要用户名，邮箱和密码',
                tags: ['user']
            }
        },
        method: 'post',
        path: '/user/register',
        validate: {
            body: {
                name: Joi.string().description('用户名，唯一').required(),
                password: Joi.string().description('密码').required(),
                email: Joi.string().description('邮箱，唯一').email().required()
            },
            output: {
                200: {
                    body: {
                        msg: Joi.any().optional(),
                        code: Joi.any().optional(),
                        data: Joi.object().keys({
                            token: Joi.string().optional().description("JWT令牌")
                        })
                    }
                }
            },
            type: 'json'
        },
        handler: controller.register
    },
    {
        meta: {
            swagger: {
                summary: '用户登录',
                description: '需要邮箱和密码',
                tags: ['user']
            }
        },
        method: 'post',
        path: '/user/login',
        validate: {
            body: {
                email: Joi.string().description('邮箱，唯一').email().required(),
                password: Joi.string().description('密码').required()
            },
            output: {
                200: {
                    body: {
                        msg: Joi.any().optional(),
                        code: Joi.any().optional(),
                        data: Joi.object().keys({
                            token: Joi.string().optional().description("JWT令牌"),
                            email: Joi.string().optional().description("邮箱"),
                            name: Joi.string().optional().description("用户名"),
                        })
                    }
                }
            },
            type: 'json'
        },
        handler: controller.login
    },
    {
        meta: {
            swagger: {
                summary: '激活邮箱',
                description: '激活邮箱',
                tags: ['user']
            }
        },
        method: 'get',
        path: '/user/activateEmail',
        handler: controller.activateEmail
    },
    {
        meta: {
            swagger: {
                summary: '获取候选人列表',
                description: '需要登录后进行操作',
                tags: ['user']
            }
        },
        method: 'get',
        path: '/user/candidateList',
        validate: {
            output: {
                200: {
                    body: {
                        msg: Joi.any().optional(),
                        code: Joi.any().optional(),
                        data: Joi.array().items({
                            _id: Joi.string().optional().description("数据库id"),
                            name: Joi.string().optional().description("用户名"),
                        })
                    }
                }
            }
        },
        handler: controller.candidateList
    },
    {
        meta: {
            swagger: {
                summary: '用户投票',
                description: '需要登录后进行操作，一个用户在规则内可给一个候选人多张票数',
                tags: ['user']
            }
        },
        method: 'post',
        path: '/user/vote',
        validate: {
            body: {
                email: Joi.string().description('用户邮箱').email().required(),
                data: Joi.array().items({
                    name: Joi.string().optional().description("候选人姓名"),
                    votes: Joi.number().optional().description("候选人票数")
                })
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
        handler: controller.vote
    }
]