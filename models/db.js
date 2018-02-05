const Mongolass = require('mongolass');

const { Schema } = Mongolass;

// 创建并连接数据库
const mongolass = new Mongolass();
// 连接成功，返回 db 实例
const db = mongolass.connect('mongodb://admin:password@localhost:27017/apps');

class Mongo {
  constructor() {
    this.db = null;
    this.schema = null;
    this.model = null;
  }

  async connect() {
    try {
      // 连接成功，返回 db 实例
      this.db = await db;
      console.log('连接成功');
      return this;
    } catch (e) {
      console.log('数据库连接失败');
      throw new Error(e);
    }
  }

  initSchema(schemaName, schemaObjct) {
    this.schema = new Schema(`${schemaName}Schema`, schemaObjct);
    this.model = mongolass.model(schemaName, this.schema, {
      collName: schemaName
    });
  }

  async insert(data) {
    try {
      await this.model.insertOne(data);
      return this;
    } catch (e) {
      throw new Error(e);
    }
  }

  async find(data) {
    try {
      const result = await this.model.find(data);
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }
}

// const test = new Collection('weixin', {
//   id: { type: 'string', required: true },
//   title: { type: 'string', required: true },
//   url: { type: 'string', required: true },
//   image: { type: 'string', required: true },
//   summary: { type: 'string', required: false, default: '' },
//   author: { type: 'string', required: false, default: '' },
//   time: { type: 'string', required: true },
//   content: { type: 'string', required: false, default: '' }
// });


// test.init().then(() => {
//   test.insert({})
// });

module.exports = Mongo;
