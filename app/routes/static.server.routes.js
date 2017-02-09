/*eslint-env node*/

//Bezieht den index controller, dieser rendert die index.ejs Seite
var index = require('../controllers/index.server.controller.js');

//Bezieht das express packet für das routing
var express = require('express');

//Stellt ein routing object zur Verfügung
var router  = express.Router();

//Legt fest, dass statische Dateien aus ./public gerendert werden, das heißt referenzierte Dateien in den gerenderten
//.ejs wie index.ejs, werden aus dem Ordner "public" bezogen.
router.use(express.static('./public'));	

//Legt fest, dass die url "/" durch den index controller behandelt wird (rendert index.ejs).
router.get('/', index.render);

//exportiert das Router Object bei Bedarf
module.exports = router;