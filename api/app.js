const { getAccounts } = require('./weixin');
const { getCategories, getAppArticleList } = require('./category');

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
  },
  {
    name: '一个',
    id: 'one',
    icon: 'http://image.wufazhuce.com/apple-touch-icon.png'
  }
];

// 微信公众号列表
const accountsList = getAccounts();


// 按照字母顺序排序
appList = appList.concat(accountsList).sort((prev, next) => (prev.name < next.name ? 1 : -1));

module.exports = {
  appList,
  getCategories,
  getAppArticleList
};

