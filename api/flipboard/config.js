module.exports = {
  params: {
    udid: '0', // 随机生成
    tuuid: '0', //
    userid: '0',
    ver: '3.2.24',
    device: 'ipad-11.2.1',
    limit: 20,
    sections: '', // 当获取数据时需要提供 sections，从导航获取 sections
    pageKey: '' // 最后一篇文章的 id
  },
  contentGuideURL: 'https://fbchina.flipboard.com/v1/static/contentGuide.json',
  contentListURL: 'https://fbchina.flipboard.com/v1/users/updateFeed/0',
  articleURL: 'https://www.flipboard.cn/hybrid/articles/http%3A%2F%2F36kr%2Ecom%2Fp%2F5117711%2Ehtml%3Fktm%5Fsource%3Dfeed'
};
