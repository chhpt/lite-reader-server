/**
 * ifanr 爱范儿数据获取
 */

const request = require('request-promise-native');
const cheerio = require('cheerio');
const menu = require('./menu');

/**
 * 解析 HTML，获取文章信息
 * @param {!Object} $ 
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
    article.image = element.find(imageClass).attr('style').match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)[0];
    // 获取文章标题
    article.title = element.find(titleClass).text();
    // 获取文章链接
    article.url = element.find(urlClass).attr('href');
    data.push(article);
    console.log(article);
  })
}

/**
 * 获取所有栏目
 * @return {!Array<Object>}
 */
const getMenus = async () => {
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
    console.log(error);
    return error; 
  }
}

/**
 * 获取文章数据
 * @param {!String} url 
 * @param {!Number} page 
 * @param {!Number} postID 
 * @return {!Array<Object>}
 */
const fetchArticles = async (url, page = 1, postID) => {
  const data = [];
  // 非第一页需要 postID
  if (page !== 1 && !postID) {
    return new Error('id 缺失');
  }
  try {
    // 判断是否为第一页，启用不同的链接
    let responseHTML = page === 1 ? await request(url) : await request(`${url}?page=${page}&pajax=1&post_id__lt=${postID}`);
    const $ = cheerio.load(responseHTML);
    // 特殊文章
    const specialArticles = $('.o-matrix__row .o-matrix__row__unit .c-card-article');
    const normalArticles = $('.o-matrix__row .o-matrix__row__unit .article-item');
    parseArticle($, data, specialArticles, '.c-card-article__thumbnail', '.c-card-article__link', '.c-card-article__link');
    parseArticle($, data, normalArticles, '.article-image', 'h3', '.article-link');
  } catch (error) {
    console.log(error);
    return error;
  }
}