const MongoDB = require('./db');

const UserSchema = {
  id: { type: 'string', required: true },
  username: { type: 'string', required: true },
  password: { type: 'string', required: true },
  email: { type: 'string', require: true },
  registerTime: { type: 'string', require: true },
  ips: { type: Array, require: false },
  readHistory: { type: Array, require: false },
  followAPPs: { type: Array, require: false }
};

const db = new MongoDB('user', UserSchema).init();

class User {
  constructor() {
    this.db = null;
  }

  async init() {
    this.db = await db;
    return this;
  }

  async checkUser(email) {
    const exitEmails = await this.db.find({ email });
    if (exitEmails.length) {
      return 1; // error: '邮箱已被占用'
    }
    return 0;
  }

  async getUser(email) {
    try {
      const users = await this.db.find({ email });
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertUser(user) {
    try {
      await this.db.insertOne(user);
      return 1;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(id, user) {
    try {
      const result = await this.db.findOneAndUpdate({ id }, { $set: user });
      // 根据是否有 value  判断是否更新成功
      return result.value ? 1 : 0;
    } catch (error) {
      throw new Error(error);
    }
  }
}

new User().init().then(async (e) => {
  await e.db.insertOne({
    id: 'fa',
    username: 'fs',
    password: 'asdfsd',
    email: 'fadsf',
    ips: ['fsad']
  });
  const res = await e.db.findOneAndUpdate({ username: 'ffsd' }, { $set: { ips: ['ffsd'] } });
  console.log(res);
}).catch((err) => {
  console.log(err);
});

module.exports = new User();

