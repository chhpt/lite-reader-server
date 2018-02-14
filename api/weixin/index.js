/**
 * 微信公众号
 */

const request = require('request-promise-native');
const cheerio = require('cheerio');

const Mongo = require('../../models/db');
const { accounts } = require('./config');

// 公众号列表
const accountsList = Object.keys(accounts);
const weixin = new Mongo('weixin', {});

/**
 * 获取所有公众号
 * @return {!Array<Object>}
 */
const getAccounts = () => {
  const allAccounts = [];
  accountsList.forEach((item) => {
    const account = {
      name: accounts[item].name,
      id: item,
      icon: accounts[item].icon,
      type: 'weixin'
    };
    allAccounts.push(account);
  });
  return allAccounts;
};

/**
 * 获取文章列表
 * @param {!Number} page
 * @param {!String} account
 * @param {!Number} limit
 * @return {!Array<Object>}
 */
const getArticleList = async (page = 1, account, limit = 20) => {
  if (!account) {
    throw new TypeError('确实公众号名');
  }
  if (!accountsList.includes(account)) {
    throw new Error('公众号不存在');
  }
  // 检查数据库中是否存在对应的表
  const { db } = await weixin.connect();
  return new Promise((resolve, reject) => {
    // 回调函数需要借用异步返回结果
    db.collection(account, { strict: true }, async (result, collection) => {
      if (result) {
        reject(new Error('数据异常'));
      } else {
        // 需要跳过的数据
        const skip = (page - 1) * limit;
        const result = await collection.find({}, { limit, skip }).toArray();
        result.forEach((item) => {
          item.title = item.title.replace(/&nbsp;/g, ' ');
          item.image = item.image.replace(/\\/g, '');
          item.url = item.url.replace(/\\/g, '');
        });
        resolve(result);
      }
    });
  });
};

/**
 * 获取文章内容
 * @param {!String} url
 * @return {!Object}
 */
const getArticle = async (url) => {
  // 对 url 进行处理
  const decodeURL = url.replace(/\\/g, '');
  const responseHTML = await request(decodeURL);
  const $ = cheerio.load(responseHTML);
  const article = {};
  // 文章标题
  article.title = $('#img-content .rich_media_title').text();
  // 文章发布时间
  article.time = $('#img-content #post-date').text();
  // 文章内容（HTML）
  const content = $('#img-content .rich_media_content ').html().replace(/data-src/g, 'src');
  article.content = content;
  return article;
};

module.exports = {
  getAccounts,
  getArticleList,
  getArticle
};

