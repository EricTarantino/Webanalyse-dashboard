/* eslint-env node*/

//exportiert eine Funktion zum rendern der register Datei, diese gibt das gerenderte register.ejs file zurück
exports.render = function(req, res) {
  /*
  if (req.session.lastVisit) {
    console.log(req.session.lastVisit);
  }
  
  req.session.lastVisit = new Date();
  */
  res.render('index', {
    title: 'Bosch Analytics',
  });
};