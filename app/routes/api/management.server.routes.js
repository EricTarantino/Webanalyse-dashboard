/*eslint-env node*/
var router = require('express').Router()
var Management   = require('../../controllers/management.server.controller')

router.route('/')
	.get(Management.getManagementDashboard)
	.post(Management.changeData)

module.exports = router
