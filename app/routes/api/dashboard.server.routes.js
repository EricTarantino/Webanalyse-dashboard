/*eslint-env node*/
var router = require('express').Router()
var Dashboard   = require('../../controllers/dashboard.server.controller')

router.route('/')
	.get(Dashboard.get)
	.post(Dashboard.post)
	.delete(Dashboard.delete)
		
module.exports = router
