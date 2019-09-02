const config = require('../config/config');
const Redis = require('ioredis');

const options = {
    password: config.redis.password,
    db: config.redis.db,
    port: config.redis.port,
    host: config.redis.host,
    keepAlive: 10000
}

const redis = Redis.createClient(options)
    .on('ready', async () => {
        console.log('redis connect is ready');
    })
    .on('error', async (e) => {
        console.log('redis connect error', e);
    });

module.exports = redis;