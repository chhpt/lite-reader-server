const dev = require('./dev.js');
const prod = require('./prod.js');

const env = process.env.NODE_ENV;

const config = env === 'prod' ? prod : dev;

module.exports = config;
