const { getAccounts } = require('./weixin');

let appList = [
  {
    name: '爱范儿',
    id: 'ifanr',
    icon: 'https://images.ifanr.cn/wp-content/themes/ifanr-4.0/static/images/ifanr/top-nav-down-logo.png'
  },
  {
    name: '少数派',
    id: 'sspai',
    icon: 'http://blog-1252710547.cossh.myqcloud.com/sspai.png'
  }
];

// 微信公众号列表
const accountsList = getAccounts();

appList = appList.concat(accountsList);

module.exports = {
  appList
};

