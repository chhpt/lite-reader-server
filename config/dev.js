/**
 * 开发环境配置
*/


module.exports = {
  port: 3000,
  db: {
    port: 27017,
    dbname: 'apps',
    username: 'admin',
    password: 'password'
  },
  session: {
    key: 'user_id',
    maxAge: 2592000000,
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
