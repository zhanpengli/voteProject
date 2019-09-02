const config = {
    development: {
        "app": {
            url: '127.0.0.1',
            port: 2019,
            jwtSecret: 'MjAxOTA4MzEqJiXvv6UjQO+8gWxpemhhbnBlbmc='
        },
        "redis": {
            "password": "",
            "host": "127.0.0.1",
            "db": 1,
            "port": 6379
        },
        "voteProjectDb": {
            host: '127.0.0.1',
            port: 27017,
            database: 'voteProject',
            name: 'votes',
            auth: false
        },
        "qq": {
            "user": "2462931175@qq.com",
            "qqSmtpCode": "ttfgonijrcgydigj"
        }

    },
    production: {
        "app": {
            url: '127.0.0.1',
            port: 2019,
            jwtSecret: 'MjAxOTA4MzEqJiXvv6UjQO+8gWxpemhhbnBlbmc='
        },
        "redis": {
            "password": "",
            "host": "127.0.0.1",
            "db": 1,
            "port": 6379
        },
        "voteProjectDb": {
            host: '127.0.0.1',
            port: 27017,
            database: 'voteProject',
            name: 'votes',
            auth: false
        },
        "qq": {
            "user": "2462931175@qq.com",
            "qqSmtpCode": "ttfgonijrcgydigj"
        }
    }
}

console.log('运行环境', process.env.NODE_ENV || 'development');
console.log(config[process.env.NODE_ENV || 'development']);
module.exports = config[process.env.NODE_ENV || 'development'];