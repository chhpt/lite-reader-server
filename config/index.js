const dev = require('./dev.js');
const prod = require('./prod.js');

const env = process.env.NODE_ENV;

const config = env === 'dev' ? dev : prod;

module.exports = config;
