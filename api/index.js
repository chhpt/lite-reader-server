/**
 * 应用分类
 * 通过 Flipboard 的接口批量获取应用
 */

const request = require('request-promise-native');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const Flip = require('./filp');
// const { writeFile } = require('../utils');

const defineCategories = {};

fs.readdirSync(path.join(__dirname, 'spider')).forEach((file) => {
  if (file.includes('.js')) return;
  defineCategories[file] = require(path.join(__dirname, 'spider', file));
});

/**
 * 获取应用分类
 * @return {!Array}
 */
const getCategories = async () => {
  const { categoryURL, params } = config;
  const responseJSON = await request({
    url: categoryURL,
    qs: params
  });
  const categories = JSON.parse(responseJSON).categories;

  // 加入自己定义的应用
  Object.keys(defineCategories).forEach((key) => {
    const i = categories.findIndex(e => e.title === config.category[key]);
    // 去除重复的应用
    defineCategories[key].appsInfo.forEach((app) => {
      const index = categories[i].sections.findIndex(item => item.title === app.title);
      if (index > -1) {
        categories[i].sections.splice(index, 1);
      }
    });
    // 拼接数组
    categories[i].sections = categories[i].sections.concat(defineCategories[key].appsInfo);
  });
  // writeFile('category.json', JSON.stringify(categories));
  return categories;
};

/**
 * 获取应用栏目
 * @param {!String} type 应用类型
 * @param {!String} appId 应用的 appId
 * @return {!Array}
 */
const getMenu = async (type, appId) => {
  let menu;
  // Flip 栏目
  if (type === '0') {
    menu = await Flip.getMenu();
  }
  // 自定义应用栏目
  if (type === '1') {
    // 获取应用所属分类
    const category = appId.split('/')[0];
    const appName = appId.split('/')[1];
    // 根据分类获取栏目
    menu = await defineCategories[category].getMenu(appName);
  }
  return menu;
};

/**
 * 获取应用的文章列表
 * @param {!String} type 应用类型
 * @param {!String} appId 应用的 appId
 * @param {*} column 栏目名称或 filp 的 section
 * @param {*} id 最后一篇文章的 id 或 page
 * @return {!Array}
 */
const getArticleList = async (type, appId, column, id, page) => {
  // section id page url column
  let list;
  if (type === '0') {
    list = await Flip.getArticleList(column, id);
  }
  // 自定义应用栏目
  if (type === '1') {
    // 获取应用所属分类
    const category = appId.split('/')[0];
    const appName = appId.split('/')[1];
    // 根据分类获取栏目
    list = await defineCategories[category].getArticleList(appName, column, id, page);
  }
  return list;
};

/**
 * 获取应用文章
 * @param {!String} type 应用类型
 * @param {!String} appId 应用的 appId
 * @param {!String} url 文章链接
 * @return {!Array}
 */
const getArticle = async (type, appId, articleInfo) => {
  let article;
  if (type === '0') {
    article = await Flip.getArticle(articleInfo);
  }
  // 自定义应用栏目
  if (type === '1') {
    // 获取应用所属分类
    const category = appId.split('/')[0];
    const appName = appId.split('/')[1];
    // 根据分类获取栏目
    article = await defineCategories[category].getArticle(appName, articleInfo);
  }
  return article;
};

module.exports = {
  getCategories,
  getMenu,
  getArticleList,
  getArticle
};

