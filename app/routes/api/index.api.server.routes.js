/*eslint-env node*/
var router = require('express').Router()

//these are all defined "/api" routes 
router.use('/post', require('./posts.server.routes.js'))

router.use('/login', require('./sessions.server.routes.js'))

router.use('/user', require('./users.server.routes.js'))

//router.use('/webtrends', require('./webtrends.server.routes.js'))

router.use('/graphdata', require('./graphdata.server.routes.js'))

router.use('/dashboard', require('./dashboard.server.routes.js'))

module.exports = router