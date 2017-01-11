/*eslint-env node*/
var router = require('express').Router()
var websockets = require('../../../config/websockets.js')
var pubsub = require('../../../config/pubsub.js')
var Post = require('../../controllers/post.server.controller.js')


//this is router and controller mixed. the funtions should be in the controller
router.route('/')
	.get(Post.find)
	.post(Post.save);

pubsub.subscribe('new_post', function (post) {
  websockets.broadcast('new_post', post)
})

module.exports = router