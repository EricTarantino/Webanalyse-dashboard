/* eslint-env node*/

//exportiert eine Funktion zum rendern der index Datei, diese gibt das gerenderte index.ejs file zurück
exports.render = function(req, res) {
  /*
  if (req.session.lastVisit) {
    console.log(req.session.lastVisit);
  }
  
  req.session.lastVisit = new Date();
  */
 
  //Gibt die gerenderte Index Datei zurück
  res.render('index', {
    title: 'Bosch Analytics',
  });
};