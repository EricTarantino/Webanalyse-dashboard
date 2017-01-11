/*eslint-env node*/
var router = require('express').Router()
var Graphdata   = require('../../controllers/graphdata.server.controller.js')

router.route('/')

	.get(Graphdata.getGraphdata)
	
	.post(Graphdata.insertNewGraphConfig)

module.exports = router