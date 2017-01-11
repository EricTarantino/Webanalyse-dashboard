/* eslint-env node*/

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