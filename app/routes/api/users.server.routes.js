/*eslint-env node*/
var router = require('express').Router()
var User   = require('../../controllers/users.server.controller')

router.route('/')
	.get(User.get)
	.post(User.post)

module.exports = router




/*
var users = require('../../controllers/users.server.controller'),
    passport = require('passport'),
    router = require('express').Router();

router.get('/signup', users.renderSignup);
router.post('/signup', users.signup);

router.get('/signin', users.renderSignin);

router.post('/signin', passport.authenticate('local', {
    		successRedirect: '/',
    		failureRedirect: '/signin',
    		failureFlash: true
    }));
    
router.get('/signout', users.signout);

router.get('/users', users.list);
router.post('/users', users.create);

router.get('/users/:userId', users.read);
router.post('/users/:userId', users.update);

module.exports = router
*/


/*
module.exports = function(app) {
	
	app.route('/signup')
    	.get(users.renderSignup)
    	.post(users.signup);
  	app.route('/signin')
    	.get(users.renderSignin)
    	.post(passport.authenticate('local', {
    		successRedirect: '/',
    		failureRedirect: '/signin',
    		failureFlash: true
    }));
  	
  	app.get('/signout', users.signout);
		
	app.route('/users')
	.post(users.create)
	.get(users.list);
	
	app.route('/users/:userId')
    .get(users.read)
    .put(users.update)
    .delete(users.delete);
    
    
  	app.param('userId', users.userByID);
};
*/
