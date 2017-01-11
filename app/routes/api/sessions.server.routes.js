/*eslint-env node*/
var router = require('express').Router()
var session = require('../../controllers/session.server.controller.js')

router.route('/')
	.post(session.post)

module.exports = router