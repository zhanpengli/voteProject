const mgs = require('mongoose');

/**
 * mongodb操作类
 */

class MongooseHelper {
    constructor(configString, opt = {}) {
        let options = {
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 10000,
            poolSize: 10,
            bufferMaxEntries: 0,
            useNewUrlParser: true
        };
        options = Object.assign(options, opt);
        this._mongoose = mgs;
        this._conn = mgs.connect(configString, options);
    }

    get connection() {
        return this._conn;
    }

    get mongoose() {
        return this._mongoose;
    }
}

module.exports = MongooseHelper;