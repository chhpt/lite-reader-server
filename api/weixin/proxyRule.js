// 控制终端打印颜色
const colors = require('colors');
const Async = require('async');

const Collection = require('../../models/db');

const weixin = new Collection('alitech', {
  id: { type: 'string', required: false },
  title: { type: 'string', required: true },
  url: { type: 'string', required: true },
  image: { type: 'string', required: true },
  time: { type: 'string', required: true },
  summary: { type: 'string', required: false, default: '' },
  author: { type: 'string', required: false, default: '' },
  content: { type: 'string', required: false, default: '' }
});

weixin.init().then(async () => {
  console.log('初始化成功');
});

// 插入自动翻页代码
const insertToNext = (content) => {
  const insertJs = `
  <script type="text/javascript">
  (function insert() {
    var end = document.createElement("div");
    document.body.appendChild(end);
    setTimeout(() => {
      end.scrollIntoView();
      insert();
    }, 1000);
  }());
  </script>`;
  content = content.replace('<!--headTrap<body></body><head></head><html></html>--><html>', '').replace('<!--tailTrap<body></body><head></head><html></html>-->', '');
  content = content.replace('</body>', `${insertJs}\n</body>`);
  return content;
};

// 文章计数
let count = 0;
const logger = colors.green;
const errorLogger = colors.red;

const log = async (list) => {
  Async.each(list, async (item) => {
    try {
      const { title } = item.app_msg_ext_info;
      const url = decodeURI(item.app_msg_ext_info.content_url);
      const image = decodeURI(item.app_msg_ext_info.cover);
      const time = item.comm_msg_info.datetime.toString();
      console.log(logger(`${++count}.${title}`));
      // 存储数据
      await weixin.insert({
        url,
        image,
        time,
        title
      });
      console.log(`${title}存储成功`.yellow);
      return 1;
    } catch (e) {
      console.log(errorLogger(item[0]), errorLogger(item[1]));
      console.log(errorLogger(`${e}`.red));
    }
  });
};

const rule = {
  // 响应被接受之前
  async beforeSendResponse(requestDetail, responseDetail) {
    // 响应
    const { response } = responseDetail;
    // 请求 url
    const { url } = requestDetail;

    /**
     * 当链接地址为公众号历史消息页面时(第一种页面形式)
     */
    if (/mp\/getmasssendmsg/i.test(url)) {
      const data = response.body.toString();
      if (data === '') return responseDetail;

      // 返回数据为 HTML 代码
      if (data.indexOf('body' > -1)) {
        // 插入自动翻页
        responseDetail.response.body = insertToNext(data);
      }

      try {
        const reg = /msgList = (.*?);/; // 定义历史消息正则匹配规则
        const ret = reg.exec(data); // 转换变量为string
        const list = ret[1].replace(/&quot;/g, '"');
        const articles = JSON.parse(list).list;
        await log(articles);
      } catch (e) {
        /**
         * 如果上面的正则没有匹配到，那么这个页面内容可能是公众号历史消息页面向下翻动的第二页，
         * 因为历史消息第一页是 HTML 格式的，第二页就是 JSON 格式的。
         */
        try {
          const json = JSON.parse(data);
          if (json.general_msg_list !== []) {
            const articles = JSON.parse(json.general_msg_list).list;
            await log(articles);
          }
        } catch (e) {
          // 错误捕捉
          console.log(e);
        }
      }
    }

    /**
     * 当链接地址为公众号历史消息页面时(第二种页面形式)
     */
    if (/mp\/profile_ext\?action=home/i.test(url)) {
      const data = response.body.toString();
      if (data === '') return responseDetail;

      // 返回数据为 HTML 代码
      if (data.indexOf('body' > -1)) {
        responseDetail.response.body = insertToNext(data);
      }

      try {
        // 定义历史消息正则匹配规则（和第一种页面形式的正则不同）
        const reg = /var msgList = \'(.*?)\';/;
        // 转换变量为string
        const ret = reg.exec(data);
        // 将 &quot 转化成 "
        const list = ret[1].replace(/&quot;/g, '"');
        const articles = JSON.parse(list).list;
        await log(articles);
      } catch (e) {
        console.log(e);
      }
    }

    /**
     * 第二种页面表现形式的向下翻页后的json
     */
    if (/mp\/profile_ext\?action=getmsg/i.test(url)) {
      const data = response.body.toString();
      try {
        const json = JSON.parse(data);
        if (json.general_msg_list !== []) {
          const list = json.general_msg_list;
          const articles = JSON.parse(list).list;
          await log(articles);
        }
      } catch (e) {
        console.log(e);
      }
    }
    return responseDetail;
  }
};

module.exports = {
  rule
};
