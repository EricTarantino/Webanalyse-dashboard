/*eslint-env node*/
var index = require('../controllers/index.server.controller.js');
var express = require('express');
var router  = express.Router();

//router.use('/templates', express.static(__dirname + '/../../public/templates'));
router.use(express.static('./public'));	

router.get('/', index.render);

module.exports = router;