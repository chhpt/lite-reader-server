/**
 * ifanr 爱范儿
 */

const request = require('request-promise-native');
const cheerio = require('cheerio');

/**
 * 解析 HTML，获取文章信息
 * @param {!Object}
 * @param {!Array} data
 * @param {!Selector} articles
 * @param {!Selector} imageClass
 * @param {!Selector} titleClass
 * @param {!Selector} urlClass
 */
const parseArticle = ($, data, articles, imageClass, titleClass, urlClass) => {
  articles.each((i, e) => {
    const article = {};
    const element = $(e);
    article.id = element.attr('data-post-id');
    // 获取文章图片链接
    [article.image] = element.find(imageClass).attr('style').match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
    if (article.image.indexOf('http') === -1) {
      article.image = `http://${article.image}`;
    }
    // 获取文章标题
    article.title = element.find(titleClass).text();
    // 获取文章发布时间
    article.time = element.find('time') ? element.find('time').text() : '无';
    // 获取文章链接
    article.url = element.find(urlClass).attr('href');
    data.push(article);
  });
};

/**
 * 获取所有栏目
 * @return {!Array<Object>}
 */
const getMenu = async () => {
  try {
    const responseHTML = await request('http://www.ifanr.com');
    const $ = cheerio.load(responseHTML);
    const menu = [];
    $('.sidebar-drawer-menu .menu-wrap li a').each((i, e) => {
      const element = $(e);
      const item = {};
      // 标题
      item.title = element.text();
      // 链接
      item.url = element.attr('href');
      menu.push(item);
    });
    return menu;
  } catch (error) {
    return error;
  }
};

/**
 * 获取文章数据
 * @param {!String} url
 * @param {!Number} page
 * @param {!Number} postID
 * @return {!Array<Object>}
 */
const fetchArticles = async (url, page = 1, postID = 0) => {
  const articles = [];
  // 非第一页需要 postID
  if (page !== 1 && !postID) {
    return new Error('id 缺失');
  }
  try {
    // 判断是否为第一页，启用不同的链接
    const responseHTML = page === 1 ? await request(url) : await request(`${url}?page=${page}&pajax=1&post_id__lt=${postID}`);
    const $ = cheerio.load(responseHTML);
    // 特殊文章
    const specialArticles = $('.o-matrix__row .o-matrix__row__unit .c-card-article');
    const normalArticles = $('.o-matrix__row .o-matrix__row__unit .article-item');
    parseArticle($, articles, specialArticles, '.c-card-article__thumbnail', '.c-card-article__link', '.c-card-article__link');
    parseArticle($, articles, normalArticles, '.article-image', 'h3', '.article-link');
    return articles;
  } catch (error) {
    return error;
  }
};

/**
 * 获取文章列表
 * @param {!Number} page
 * @param {!String} column
 * @param {!String} url
 * @param {!Number} id
 * @return {!Array<Object>}
 */
const getArticleList = async (page = 1, column, url, id) => {
  const articles = await fetchArticles(url, page, id);
  return articles;
};

/**
 * 获取文章内容
 * @param {!String} url
 * @return {!Object}
 */
const getArticle = async (url) => {
  const responseHTML = await request(url);
  const $ = cheerio.load(responseHTML);
  const article = {};
  // 文章标题
  article.title = $('.c-single-normal__title').text();
  // 文章发布时间
  article.time = $('.c-article-header-meta__time').text();
  // 文章内容（HTML）
  article.content = $('article.o-single-content__body__content').html();
  return article;
};

module.exports = {
  getMenu,
  getArticleList,
  getArticle
};
