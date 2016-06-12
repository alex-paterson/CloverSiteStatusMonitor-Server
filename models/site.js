var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Test = require('./test').model;
var testSchema = require('./test').schema;


var siteSchema = new Schema({
  name: {type: String},
  url: {type: String},
  _id: {type: String},
  tests: [testSchema]
});

exports.schema = siteSchema;
exports.model = mongoose.model('site', siteSchema);
