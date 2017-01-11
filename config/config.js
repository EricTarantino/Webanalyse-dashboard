/*eslint-env node*/

//load the configuration file according to the process.env.NODE_ENV
module.exports = require('./env/' + process.env.NODE_ENV + '.js');