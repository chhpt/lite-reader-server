const path = require('path');
const fs = require('fs');
const appsInfo = require('./app');

const apps = {};

// 动态引入应用
fs.readdirSync(__dirname).forEach((file) => {
  if (file.includes('.js')) return;
  apps[file] = require(path.join(__dirname, file));
});

/**
 * 根据应用获取栏目
 * @param {!String} appName 应用名称
 */
const getMenu = async (appName) => {
  const menu = await apps[appName].getMenu();
  return menu;
};

const getArticleList = async (appName, column, id, page) => {
  const articles = await apps[appName].getArticleList(column, id, page);
  return articles;
};

const getArticle = async (appName, articleInfo) => {
  const articles = await apps[appName].getArticle(articleInfo);
  return articles;
};


module.exports = {
  appsInfo,
  getMenu,
  getArticleList,
  getArticle
};
