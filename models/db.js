const mongoose = require('mongoose');
const config = require('../config');

const { dbname, username, password, port } = config.db;

// 创建并连接数据库
mongoose.connect(`mongodb://${username}:${password}@localhost:${port}/${dbname}`);

mongoose.Promise = global.Promise;

const db = mongoose.connection;


db.once('open', () => {
  console.log('连接数据成功');
});

db.on('error', (error) => {
  console.error(`Error in MongoDb connection: ${error}`);
  mongoose.disconnect();
});

db.on('close', () => {
  console.log('数据库断开，重新连接数据库');
});

class MongoDB {
  /**
   * 构造函数
   * @param {*} collecion 集合名称
   * @param {*} schemaObjct 集合的表结构
   */
  constructor(collectionName, schemaObjct) {
    const { Schema } = mongoose;
    const schema = new Schema(schemaObjct);
    this.connection = mongoose.connection;
    // model
    this.model = mongoose.model(collectionName, schema);
  }
}

module.exports = MongoDB;
