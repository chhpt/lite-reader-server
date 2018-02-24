/**
 * 生产环境配置
*/

module.exports = {
  port: 3000,
  db: {
    port: 0,
    dbname: '',
    username: '',
    password: ''
  },
  session: {
    key: 'user_id',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    renew: true
  },
  email: {
    user: '',
    password: ''
  }
};
