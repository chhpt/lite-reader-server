/**
 * 应用分类
 * 通过 Flipboard 的接口批量获取应用
 */

const request = require('request-promise-native');
const config = require('./config');
// const { writeFile } = require('../utils');

const tech = require('./tech');
const art = require('./art');

// 自己定义的应用
const defineCategories = [
  {
    title: 'tech',
    apps: tech.apps
  }, {
    title: 'art',
    apps: art.apps
  }
];

/**
 * 获取分类
 */
const getCategories = async () => {
  const { categoryURL, params } = config;
  const responseJSON = await request({
    url: categoryURL,
    qs: params
  });
  const categories = JSON.parse(responseJSON).categories;
  // 加入自己定义的应用
  defineCategories.forEach((category) => {
    const i = categories.findIndex(e => e.title === config.category[category.title]);
    // 去除重复的应用
    category.apps.forEach((app) => {
      const index = categories[i].sections.findIndex(item => item.title === app.title);
      if (index > -1) {
        categories[i].sections.splice(index, 1);
      }
    });
    // 拼接数组
    categories[i] = categories[i].sections.concat(category.apps);
  });
  return categories;
};

module.exports = {
  getCategories
};

