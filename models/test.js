var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var testSchema = new Schema({
  name: {type: String},
  extension: {type: String},
  match: {type: String},
  _id: {type: String}
});

exports.schema = testSchema;
exports.model = mongoose.model('test', testSchema);
