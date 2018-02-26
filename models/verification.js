const MongoDB = require('./db');


const CodeSchema = {
  _id: String,
  code: String,
  email: String,
  date: Date
};

const { model } = new MongoDB('varification', CodeSchema);

class Varification {
  constructor() {
    this.db = model;
  }

  async getCode(email) {
    const data = await this.db.findOne({ email });
    // 不存在
    if (!data) {
      return null;
    }
    const time = new Date(Date.now()) - new Date(data.date);
    // 超过十分钟失效
    const code = time > 10 * 60 * 1000 ? null : data.code;
    return code;
  }

  async setCode(code, email) {
    await this.db.findOneAndUpdate({ email }, { code, date: new Date() }, { upsert: true });
    const result = await this.db.findOne({ email });
    return result;
  }
}

module.exports = new Varification();

