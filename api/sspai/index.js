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
      url: 'https://sspai.com/matrix'
    },
    {
      title: '效率工具',
      url: 'https://sspai.com/tag/%E6%95%88%E7%8E%87%E5%B7%A5%E5%85%B7#home'
    },
    {
      title: '手机摄影',
      url: 'https://sspai.com/tag/%E6%89%8B%E6%9C%BA%E6%91%84%E5%BD%B1#home'
    },
    {
      title: '生活方式',
      url: 'https://sspai.com/tag/%E7%94%9F%E6%B4%BB%E6%96%B9%E5%BC%8F#home'
    },
    {
      title: '游戏',
      url: 'https://sspai.com/tag/%E6%B8%B8%E6%88%8F#home'
    },
    {
      title: '硬件',
      url: 'https://sspai.com/tag/%E7%A1%AC%E4%BB%B6#home'
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
  console.log(page, limit, isMatrix, tag);
  const url = isMatrix
    ? `${baseURL}/articles?offset=${(page - 1) * limit}&limit=${limit}&is_matrix=1&sort=matrix_at&include_total=${includeTotal}`
    : `${baseURL}/articles?offset=${(page - 1) * limit}&limit=${limit}&has_tag=1&tag=${encodeURI(tag)}&include_total=${includeTotal}&type=recommend_to_home`;
  let responseJSON;
  console.log(url);
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
const getArticleList = async (page = 1, column) => {
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
const getArticle = async (url) => {
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
