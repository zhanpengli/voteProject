const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Models {
	/**
	 * 创建数据库连接
	 * @param  {Object} opt 数据库配置
	 * @return {Object}     数据库实例
	 */
	createDb (opt) {
		let auth = '';
		if (opt.auth) auth = opt.user + ':' + opt.password + '@';
		let uri = 'mongodb://' + auth + opt.host + ':' + opt.port + '/' + opt.database;
		let conn = mongoose.createConnection(uri);

		let dbModel = {};
		let models = require('./' + opt.name);
		
		function getModel (db, name) {
			let dbName = db;
			if (!!name) dbName += '_' + name;
			if (!!dbModel[dbName]) return dbModel[dbName];

			let dbSchema = new Schema(models[db].schema, {versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}});
			if (models[db].indexes && models[db].indexes.length) {
				models[db].indexes.forEach(function (index) {
					dbSchema.index(index.keys, index.property);
				});
			}
			dbSchema.statics.findAndModify = function (query, update, doc, options, callback) {
				return this.collection.findAndModify(query, update, doc, options, callback);
			};
			dbModel[dbName] = conn.model(db, dbSchema, dbName);
			return dbModel[dbName];
		};
		return getModel;
	};

};

module.exports = new Models();