/*eslint-env node*/

module.exports = {
  
  //database password
  db: 'mongodb://bdb_db:BFArwdHJPgYUkGjG@aws-us-east-1-portal.8.dblayer.com:15226/bdb_db?ssl=true',
  
  // Development configuration options
  sessionSecret: 'developmentSessionSecret' ,
  
  secret: 'jwtsupersecretkey',
  
  facebook: {
    clientID: 'Application Id',
    clientSecret: 'Application Secret',
    callbackURL: 'http://localhost:3000/oauth/facebook/callback'
  }
  
};