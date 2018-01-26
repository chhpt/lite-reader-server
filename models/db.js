const Mongolass = require('mongolass');

const { Schema } = Mongolass;

// 创建并连接数据库
const AppDB = new Mongolass();
const connection = AppDB.connect('mongodb://admin:password@localhost:27017/apps');

class Collection {
  constructor(schemaName, schemaObjct) {
    this.connection = connection;
    this.schema = new Schema(`${schemaName}Schema`, schemaObjct);
    this.model = AppDB.model(schemaName, this.schema);
  }

  async init() {
    try {
      this.connection = this.connection ? this.connection : await AppDB.connect('mongodb://admin:password@localhost:27017/apps');
      console.log('连接成功');
      return this;
    } catch (e) {
      throw new Error(e);
    }
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
      const result = this.model.find(data);
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

module.exports = Collection;
