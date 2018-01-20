# LiteReader 的服务端

这是 LiteReader 的服务器，主要提供数据抓取服务。

## API

### 获取应用程序列表

方法：GET

URL：`/get_app_list`

参数：空

Response

```JSON
[
  {
    "title": "爱范儿",
    "id": "ifanr"
  }
]
```

### 获取应用的栏目

方法：GET

URL：`/get_menu`

参数：

- app: 应用 id

Response:

```JSON
[
  {
    "title": "游戏",
    "url": "https://sspai.com/tag/%E6%B8%B8%E6%88%8F#home"
  }
]
```

### 获取栏目的文章列表

方法：GET

URL：`/get_article_list`

参数：

- app： 应用 id
- page： 页数
- column：栏目名
- url：栏目 url
- id：最后一个文章的 id

Response:

```JSON
[
  {
    "title": "文章标题",
    "intro": "这是一篇文章",
    "time": "一天前",
    "url": "http:article.com/post/9658304",
    "image": "http://cdn.ifanr.com",
    "id": 9658304
  }
]
```

### 获取文章内容

方法：GET

URL：`/get_article`

参数：

- app： 应用 id
- url：文章 url

Response:

```JSON
[
  {
    "title": "文章标题",
    "time": "一天前",
    "content": "内容 HTML"
  }
]
```