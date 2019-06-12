'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uploadfileSchema = Schema({
	description: String,
	year: Number,
	month: Number,
	fileu: String,
	user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Uploadfile', uploadfileSchema);