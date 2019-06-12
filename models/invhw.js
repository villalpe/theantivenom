'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invhwSchema = Schema({
	name_fa: String,
	type_fa: String,
	impact: String,
	location: String,
	manageby: String,
	depto: String,
	year: Number,
	month: Number,
	status: Boolean,
	usedby: String,
	etiq_fa: Number,
	user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Invhw', invhwSchema);