/*eslint-env node*/
var router    = require('express').Router();
var Webtrends = require('../../controllers/webtrends.server.controller');
var GoogSearchCon = require('../../controllers/GoogSearchCon.server.controller.js');

router.route('/')
	.get(Webtrends.get)
	.get(GoogSearchCon.get)

module.exports = router;