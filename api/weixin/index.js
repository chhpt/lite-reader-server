const request = require('request-promise-native');
const cheerio = require('cheerio');

// const { writeFile } = require('../../utils');

const search = async (app) => {
  const url = `http://weixin.sogou.com/weixin?type=1&query=${encodeURI(app)}&ie=utf8&_sug_=y&_sug_type_=1`;
  const responseHTML = await request(url);
  const $ = cheerio.load(responseHTML);
  $('.news-box .news-list2 li').each((i, e) => {
    const element = $(e);
    const target = element.find('.txt-box .tit a');
    const url = target.attr('href');
    const appName = target.text();
    console.log(appName, url);
  });
  // console.log(responseHTML);
};

search('阿里技术');
