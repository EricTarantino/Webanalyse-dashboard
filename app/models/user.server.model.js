/*eslint-env node*/
//
// This model also holds the start date and end date for the management dashboard (date picker)
// mmdbStartDate, mmdbEndDate
//
//var mongoose = require('../../config/mongoose.js');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var options = { collection : "18_15_pm" }

var UserSchema = mongoose.Schema({
	
  username: 		{ type: String, 	required: true, 	unique: false  },
  password: 		{ type: String, 	required: true, 	select: false },
  useremail: 		{ type: String, 	required: true, 	unique: true, uniqueCaseInsensitive: true  },
  userrights: 		{ type: String, 	required: true,	 	unique: false },
  userdashboards: 	{ type: [String], 	required: false, 	unique: false },
  mmdbAccess: 		{ type: String, 	required: false,	unique: false },
  mmdbStartDate: 	{ type: String, 	required: false, 	unique: false },
  mmdbEndDate: 		{ type: String, 	required: false, 	unique: false }

}, options);

UserSchema.plugin(uniqueValidator);

var user = mongoose.model('User', UserSchema);

module.exports = user;