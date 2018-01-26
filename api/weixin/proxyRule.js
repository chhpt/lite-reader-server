// 控制终端打印颜色
const colors = require('colors');

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

const log = (lists) => {
  lists.forEach((item) => {
    try {
      const { title } = item.app_msg_ext_info;
      logger(`${++count}.${title}`.green);
    } catch (e) {
      errorLogger(lists);
      errorLogger(item);
      errorLogger(`${e}`.red);
    }
  });
};

module.exports = {
  // 响应被接受之前
  async beforeSendResponse(requestDetail, responseDetail) {
    // 响应
    const { response } = responseDetail;
    // 请求 url
    const { url } = requestDetail;

    // 当链接地址为公众号历史消息页面时(第一种页面形式)
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
        log(articles);
      } catch (e) {
        /**
         * 如果上面的正则没有匹配到，那么这个页面内容可能是公众号历史消息页面向下翻动的第二页，
         * 因为历史消息第一页是 HTML 格式的，第二页就是 JSON 格式的。
         */
        try {
          const json = JSON.parse(data);
          if (json.general_msg_list !== []) {
            const articles = JSON.parse(json.general_msg_list).list;
            log(articles);
          }
        } catch (e) {
          // 错误捕捉
          errorLogger(e);
        }
      }
      return responseDetail;
    }

    // 当链接地址为公众号历史消息页面时(第二种页面形式)
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
        log(articles);
      } catch (e) {
        errorLogger(e);
      }
      return responseDetail;
    }

    // 第二种页面表现形式的向下翻页后的json
    if (/mp\/profile_ext\?action=getmsg/i.test(url)) {
      const data = response.body.toString();
      try {
        const json = JSON.parse(data);
        if (json.general_msg_list !== []) {
          const list = json.general_msg_list;
          const articles = JSON.parse(list).list;
          log(articles);
        }
      } catch (e) {
        errorLogger(e);
      }
    }

    // 返回响应
    return new Promise((resolve) => {
      resolve(responseDetail);
    });
  }
};
