/**
 * sspai 少数派
 */
const request = require('request-promise-native');
const cheerio = require('cheerio');

// const { writeFile } = require('../../utils');
const { baseURL, baseArticleURL, baseImageURL } = require('./config');

/**
 * 解析时间
 * @param {!Number} time 秒
 * @return {!String}
 */
const parseTime = (time) => {
  const now = Date.now();
  const past = parseInt(now / 1000, 10) - time;
  switch (true) {
    case past < 3600: {
      const t = parseInt(past / 60, 10);
      return `${t !== 0 ? t : t + 1} 分钟前`;
    }
    case past < 86400: {
      const t = parseInt(past / 3600, 10);
      return `${t !== 0 ? t : t + 1} 小时前`;
    }
    default: {
      const t = parseInt(past / 86400, 10);
      return `${t !== 0 ? t : t + 1} 天前`;
    }
  }
};

/**
 * 获取栏目
 * 少数派是基于 Vue 的单页应用
 * @return {!Array<Object>}
 */
const getMenu = async () => {
  const menu = [
    {
      title: 'Matrix',
      name: 'Matrix'
    },
    {
      title: '效率工具',
      name: '效率工具'
    },
    {
      title: '手机摄影',
      name: '手机摄影'
    },
    {
      title: '生活方式',
      name: '生活方式'
    },
    {
      title: '游戏',
      name: '游戏'
    },
    {
      title: '硬件',
      name: '硬件'
    }
  ];
  return menu;
};

/**
 * 获取文章列表
 * @param {!Number} page
 * @param {!Number} limit
 * @param {!Boolean} isMatrix
 * @param {!String} tag
 * @param {!Boolean} includeTotal
 * @return {!JSON}
 */
const fetchArticles = async (page = 1, limit = 20, isMatrix = true, tag, includeTotal = false) => {
  const url = isMatrix
    ? `${baseURL}/articles?offset=${(page - 1) * limit}&limit=${limit}&is_matrix=1&sort=matrix_at&include_total=${includeTotal}`
    : `${baseURL}/articles?offset=${(page - 1) * limit}&limit=${limit}&has_tag=1&tag=${encodeURI(tag)}&include_total=${includeTotal}&type=recommend_to_home`;
  let responseJSON;
  try {
    responseJSON = await request(url);
  } catch (error) {
    return new Error('网络错误');
  }
  return responseJSON;
};

/**
 * 获取文章列表
 * @param {!Number} page
 * @param {!String} column 栏目
 * @param {!Number} limit
 * @return {!Array<Object>}
 */
const getArticleList = async (column, id, page) => {
  let responseJSON = '';
  if (column === 'Matrix') {
    responseJSON = await fetchArticles(page, 20, true);
  } else {
    responseJSON = await fetchArticles(page, 20, false, column);
  }
  const articleList = [];
  const data = JSON.parse(responseJSON);
  if (data.list) {
    data.list.forEach((e) => {
      const article = {};
      article.title = e.title;
      article.summary = e.summary;
      article.url = `${baseArticleURL}/${e.id}`;
      article.image = e.banner !== '' ? `${baseImageURL}/${e.banner}?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x220` : '';
      article.id = e.id;
      article.time = parseTime(e.released_at);
      articleList.push(article);
    });
  } else {
    return new Error('解析错误');
  }
  return articleList;
};

/**
 * 获取文章内容
 * @param {!String} url
 * @return {!Object}
 */
const getArticle = async ({ url }) => {
  const responseHTML = await request(url);
  const $ = cheerio.load(responseHTML);
  const article = {};
  // 文章标题
  article.title = $('.main article .title').text();
  // 文章发布时间
  article.time = $('.main article .meta').find('time').text();
  // 文章内容（HTML）
  article.content = $('.main article .article-content .content').html();
  return article;
};

module.exports = {
  getMenu,
  getArticleList,
  getArticle
};
