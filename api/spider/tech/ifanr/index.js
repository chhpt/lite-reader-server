/**
 * ifanr 爱范儿
 */

const request = require('request-promise-native');
const cheerio = require('cheerio');
const config = require('./config');

/**
 * 获取所有栏目
 * @return {!Array<Object>}
 */
const getMenu = async () => {
  const menu = [];
  Object.keys(config.menu).forEach((key) => {
    menu.push({
      title: config.menu[key].title,
      name: key
    });
  });
  return menu;
};

/**
 * 获取文章列表
 * @param {!String} column 栏目名称
 * @param {!Number} id 最后一篇文章的 id
 * @return {!Array<Object>}
 */
const getArticleList = async (column, id) => {
  const articles = [];
  const { url } = config.menu[column];
  const responseJSON = await request(`${url}&post_id__lt=${id}`);
  // 对数据进行处理
  JSON.parse(responseJSON).data.forEach((item) => {
    const { title, ID, author, pubDate, link, excerpt, image, content } = item;
    articles.push({
      title,
      author,
      content,
      image,
      summary: excerpt,
      url: link,
      id: ID,
      time: pubDate
    });
  });
  return articles;
};

/**
 * 获取文章内容
 * @param {!String} url
 * @return {!Object}
 */
const getArticle = async (param) => {
  const { url } = param;
  const responseHTML = await request(url);
  const $ = cheerio.load(responseHTML);
  const article = param;
  // 文章内容（HTML）
  article.content = $('article.o-single-content__body__content').html();
  return article;
};

module.exports = {
  getMenu,
  getArticleList,
  getArticle
};
