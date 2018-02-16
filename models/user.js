const MongoDB = require('./db');

const UserSchema = {
  username: String,
  password: String,
  email: String, // 邮箱，唯一
  registerTime: Date, // 注册时间
  ips: Array, // 访问 ip
  readHistory: Array, // 阅读的历史文章
  followAPPs: Array, // 关注的应用
  setting: Object // 个人设置信息
};

const { model } = new MongoDB('user', UserSchema);

class User {
  constructor() {
    this.db = model;
  }

  async checkUser(email) {
    const exitEmails = await this.db.find({ email });
    if (exitEmails.length) {
      return 1; // error: '邮箱已被占用'
    }
    return 0;
  }

  async getUser({ email, id } = {}) {
    try {
      const user = email ? await this.db.findOne({ email }) : await this.db.findById(id);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertUser(user) {
    try {
      // 返回插入的数据
      const result = await this.db.insertMany(user);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserByEmail(email, data) {
    try {
      const result = await this.db.findOneAndUpdate({ email }, data);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserById(id, data) {
    try {
      const result = await this.db.findByIdAndUpdate(id, data);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }


  async addUserFollow(id, app) {
    try {
      const result = await this.db.findByIdAndUpdate(id, { $push: { followAPPs: app } });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async cancelUserFollow(id, app) {
    try {
      const result = await this.db.update(
        {
          _id: id,
          'followAPPs.title': app.title
        },
        {
          $set: {
            'followAPPs.$.delete': 1
          }
        }
      );
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}

// {
//   id: 'fa',
//   username: 'fs',
//   password: 'asdfsd',
//   email: 'fadsf',
//   ips: ['fsad']
// }

new User().cancelUserFollow('5a858d11501f6b4ce7338f04', { title: '36氪' });

module.exports = new User();

