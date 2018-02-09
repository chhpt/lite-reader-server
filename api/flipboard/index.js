/**
 * Flipboard
 * 通过 Flipboard 的接口批量获取应用
 */

const request = require('request-promise-native');
const config = require('./config');
const { writeFile } = require('../../utils');

let categories;

const getCategories = async () => {
  const { categoryURL, params } = config;
  if (categories) {
    return categories;
  }
  const responseJSON = await request({
    url: categoryURL,
    qs: params
  });
  categories = JSON.parse(responseJSON).sections;
  return categories;
};

const getAppArticleList = async (section, id) => {
  const { contentListURL, params } = config;
  params.sections = section;
  params.pageKey = id;
  const res = await request({
    url: contentListURL,
    qs: params,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
    }
  });
  const data = res.split('\n').filter((e) => {
    try {
      const obj = JSON.parse(e);
      return obj.id && obj.hashCode;
    } catch (error) {
      return false;
    }
  }).map((e) => {
    const parseData = JSON.parse(e);
    // 根据原数据 type 提取主要数据
    const item = parseData.type === 'sectionCover' ? parseData.mainItem : parseData;
    const article = {};
    article.title = item.title;
    article.id = item.id;
    article.summary = item.excerptText;
    article.time = item.dateCreated;
    article.image = item.inlineImage ? item.inlineImage.mediumURL : '';
    return article;
  });
  // 去除可能重复的第一个和第二个文章
  if (data[0].title === data[1].title) {
    data.shift();
  }
  return data;
};

module.exports = {
  getCategories,
  getAppArticleList
};

