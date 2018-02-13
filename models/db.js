const Mongolass = require('mongolass');
const config = require('../config');

const { Schema } = Mongolass;

// 创建并连接数据库
const mongolass = new Mongolass();

const { dbname, username, password, port } = config.db;
const db = mongolass.connect(`mongodb://${username}:${password}@localhost:${port}/${dbname}`);

class MongoDB {
  /**
   * 构造函数
   * @param {*} collecion 集合名称
   * @param {*} schemaObjct 集合的表结构
   */
  constructor(collecion, schemaObjct) {
    this.schemaName = collecion;
    this.schemaObjct = schemaObjct;
    this.db = null;
    this.schema = null;
    this.model = null;
  }

  async init() {
    try {
      // 连接成功，返回 db 实例
      this.db = await db;
      // 连接成功，返回 db 实例
      console.log('连接成功');
      // 创建表
      this.schema = new Schema(`${this.schemaName}Schema`, this.schemaObjct);
      this.model = mongolass.model(this.schemaName, this.schema, {
        collName: this.schemaName
      });
      return this.model;
    } catch (e) {
      console.log('数据库连接失败');
      throw new Error(e);
    }
  }
}

module.exports = MongoDB;
