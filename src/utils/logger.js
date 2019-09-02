/**
 * 日志输出
 * 开发环境下日志输出级别为trace
 * 生成环境下日志数据级别为info
 */

const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: {
            type: 'console'
        },
        dateFile: {
            daysToKeep: 5,
            type: 'dateFile',
            filename: 'logs/log.log',
            pattern: 'yyyy-MM-dd',
            compress: true
        }
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'trace'
        },
        dateFile: {
            appenders: ['dateFile'],
            level: 'info'
        }
    },
    pm2: true
});
const outLog = log4js.getLogger('default');
const fileLog = log4js.getLogger('dateFile');

const logger = {
    production: fileLog,
    development: outLog,
    test: outLog
};

module.exports = logger[process.env.NODE_ENV || 'development']