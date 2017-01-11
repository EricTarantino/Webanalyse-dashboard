/*eslint-env node*/
var pubsub = require('../../config/pubsub')
//var Post = require('../models/post.server.model.js')

var mongoose = require( 'mongoose' ),  
    Post = mongoose.model('Post');

exports.find = function (req, res, next) {
  Post.find()
  .sort('-date')
  .exec(function (err, posts) {
    if (err) { return next(err) }
    return res.json(posts)
  })
}

exports.save = function (req, res, next) {
  var post = new Post({body: req.body.body})
  post.username = req.auth.username
  post.save(function (err, post) {
    if (err) { return next(err) }
    pubsub.publish('new_post', post)
    return res.status(201).json(post)
  })
}