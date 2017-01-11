/*eslint-env node*/
var register = require('../controllers/register.server.controller.js');

var index = require('../controllers/index.server.controller.js');
var express = require('express');
var router  = express.Router();
var bodyParser = require('body-parser')

//module.exports = function(app) {
router.use(require('../../config/auth.js'))
router.use(bodyParser.json())

router.use('/api', require('./api/index.api.server.routes.js'))

router.use('/', require('./static.server.routes.js'))

//for register, we render the index page but with the register route, there is no link to get to this route for the user
router.use('/register', index.render)
	
/*old code
    //list all the possible routes, in order to render index
    app.get('/', index.render);
    //app.get('/second', index.render);
    //app.get('#/second', index.render);
    //app.get('/third', index.render);
    //app.get('#/third', index.render);
    //app.get('/signup', index.render);
    */
//};


module.exports = router	