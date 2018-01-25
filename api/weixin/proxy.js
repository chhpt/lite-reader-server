const AnyProxy = require('anyproxy');

const rule = require('./proxyRule');

const options = {
  rule,
  port: 8880,
  webInterface: {
    enable: true,
    webPort: 8002,
    wsPort: 8003
  },
  throttle: 10000,
  forceProxyHttps: true,
  silent: false
};
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => { /* */ });
proxyServer.on('error', () => { /* */ });
proxyServer.start();

// when finished
proxyServer.close();
