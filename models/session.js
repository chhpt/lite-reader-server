const MongoDB = require('./db');


const SessionSchema = {
  _id: String,
  data: Object,
  createdAt: Date,
  maxAge: Number
};

const { model } = new MongoDB('session', SessionSchema);

class SessionStore {
  constructor() {
    this.db = model;
  }

  async destroy(key) {
    await this.db.remove({ _id: key });
    return 1;
  }

  async get(key) {
    // 获取存储的 session 的 data
    const result = await this.db.findOne({ _id: key });
    return result ? result.data : null;
  }

  async set(key, data, maxAge = 86400) {
    const record = {
      _id: key,
      data,
      maxAge,
      createdAt: new Date().toLocaleString()
    };
    await this.db.findOneAndUpdate({ _id: key }, record, { upsert: true });
    return data;
  }
}

module.exports = new SessionStore();

