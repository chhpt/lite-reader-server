const request = require('request-promise-native');

// const category = 'https://app.jike.ruguoapp.com/1.0/topics/recommendation/categories';

const getTopics = async () => {
  const option = {
    url: 'https://app.jike.ruguoapp.com/1.0/topics/recommendation/list',
    method: 'POST',
    headers: {
      'User-Agent': '%E5%8D%B3%E5%88%BB/1052 CFNetwork/893.14.2 Darwin/17.3.0',
      'Cookie': 'jike:config:searchPlaceholderLastInfo=1518856262250#1; jike:sess=eyJfdWlkIjoiNWE4N2E5N2M1MTQ2ZWYwMDE4ZmIyNmQ2IiwiX3Nlc3Npb25Ub2tlbiI6InlEWTY5RW52SThTMU1COHpxU1lxTXc3dmcifQ==; jike:sess.sig=fQb5OsYARHbdMb8kvNeW3I0OC5o'
    },
    form: {
      categoryAlias: 'TECH'
    }
  };
  const res = await request(option);
  return JSON.parse(res);
};

module.exports = {
  getTopics
};
