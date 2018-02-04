/**
 * 一个
 */

const request = require('request-promise-native');
const { articleDetailURL } = require('./config');

/**
 * 获取栏目
 * @return {!Array<Object>}
 */
const getMenu = () => {
  const menu = [
    {
      title: '首页',
      url: 'http://v3.wufazhuce.com:8000/api/channel/one/date/0'
    },
    {
      title: '图文',
      url: 'http://v3.wufazhuce.com:8000/api/all/list/0'
    },
    {
      title: '阅读',
      url: 'http://v3.wufazhuce.com:8000/api/all/list/1'
    },
    {
      title: '连载',
      url: 'http://v3.wufazhuce.com:8000/api/all/list/2'
    },
    {
      title: '问答',
      url: 'http://v3.wufazhuce.com:8000/api/all/list/3'
    },
    {
      title: '音乐',
      url: 'http://v3.wufazhuce.com:8000/api/all/list/4'
    },
    {
      title: '影视',
      url: 'http://v3.wufazhuce.com:8000/api/all/list/5'
    }
  ];
  return menu;
};

/**
 * 获取文章列表
 * @param {!Number} page
 * @param {!String} column 栏目
 * @param {!String} url 栏目对应的 URL
 * @return {!Array<Object>}
 */
const getArticleList = async (page = 1, column, url) => {
  const articleList = [];
  let data = null;
  if (column === '首页') {
    const current = page > 1 ? new Date() + ((page - 1) * 86400000) : new Date();
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const day = current.getDate();
    const date = `${year}-${month}-${day}`;
    const idnexURL = url.replace(/date/, date);
    const responseJSON = await request(idnexURL);
    data = JSON.parse(responseJSON).data.content_list;
  } else {
    // 获取列表
    const responseJSON = await request(url);
    const content = JSON.parse(responseJSON).html_content;
    // 通过正则表达式提取数据
    const reg = /var allarticles=\[.+\]/;
    const jsonData = reg.exec(content)[0].replace(/var allarticles=/, '');
    // 获取列表数组
    const allLists = JSON.parse(jsonData);
    data = allLists[page - 1].list;
  }
  data.forEach((item) => {
    const article = {};
    article.id = item.item_id ? item.item_id : item.id;
    article.title = item.title ? item.title : item.t;
    article.url = item.share_url;
    article.image = item.img_url ? item.img_url : `http://image.wufazhuce.com/${item.co}`;
    article.summary = item.forward;
    article.time = item.post_date ? item.post_date : item.d;
    // 内容类型
    article.category = item.category;
  });
  return articleList;
};

/**
 * 获取文章详情
 * @param {!String} url -
 * @param {!Object} payload 部分参数
 * @return {!Object}
 */
const getArticle = async (url, payload) => {
  // 文章的 ID 和 类型
  const { id, category } = payload;
  try {
    const url = articleDetailURL[category].replace(/id/, id);
    const responseJSON = await request(url);
    const data = JSON.parse(responseJSON).data;
    const article = {};
    article.title = data.title;
    article.url = data.web_url;
    article.content = data.html_content;
    return article;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMenu,
  getArticleList,
  getArticle
};
