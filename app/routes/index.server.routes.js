/*eslint-env node*/

//Bezieht den controller der register.ejs datei.
var register = require('../controllers/register.server.controller.js');

//Bezieht das express packet für das routing.
var express = require('express');

//Bezieht die Methode express Router für das routing.
var router  = express.Router();

//Bezieht den body parser um mit req.body json files auszulesen.
var bodyParser = require('body-parser');

//Bezieht auth.js für die dekodierung von session headern.
router.use(require('../../config/auth.js'));

//Aktiviert den body parser um mit req.body json files auszulesen.
router.use(bodyParser.json());

//Legt fest, dass die url /api durch das routing in index.server.routes.js, (index Tabelle für das Routing über API) behandelt wird.
router.use('/api', require('./api/index.api.server.routes.js'));

//Legt fest, dass die url "/" duch das routing in static.server.routes.js behandelt wird.
router.use('/', require('./static.server.routes.js'));

//Legt fest, dass die url "/register" durch den register controller behandelt wird (rendert register.ejs).
router.use('/register', register.render);

//Exportiert router
module.exports = router;

