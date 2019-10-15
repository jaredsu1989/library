//Model and Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LibrarySchema = new Schema({
  title: {required: true, type: String},
  comment: [String]
  
});

module.exports = mongoose.model('libraryModel', LibrarySchema);