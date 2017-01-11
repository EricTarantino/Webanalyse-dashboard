/*eslint-env node*/

//export eines JSONs der einen User modelliert, user and methods
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;
    
var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
  	type: String,
  	unique: true,
  	match: /.+\@.+\..+/
  },
  username: {
    type: String,
    trim: true,
    index: true,
    required:  'Username is required'
  },
  password: {
  	type: String,
  	validate: [
    	function(password) {
    	return password.length >= 6;
    	},
    	'Das Passwort sollte mehr als 6 Zeichen haben '
	]
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  created: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['Admin', 'Board', 'Manager']
  },
});

//static method on the User, may be called from the User collection
UserSchema.statics.findOneByUsername = function (username, callback) {
  this.findOne({ username: new RegExp(username, 'i') }, callback);
};

//virtual field
UserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
  var splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});

//pre middleware
UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new  
      Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

//set a password
UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000,  
    64).toString('base64');
};

//method of a User model instance, may be called from a user document
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

//a model/ document may have pre and post methods
UserSchema.post('save', function(next) {
  if(this.isNew) {
    console.log('A new user was created.');
  } else {
    console.log('A user updated is details.');
  }
});

//find open username
UserSchema.statics.findUniqueUsername = function(username, suffix,  
  callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');
  _this.findOne({
    username: possibleUsername
  }, function(err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) +  
          1, callback);
      }
    } else {
      callback(null);
    }
  });
};

//
UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('User', UserSchema);

//Shemas Reference with DBRef 
