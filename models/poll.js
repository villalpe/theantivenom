'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = Schema({
	question_one: String,
	question_two: String,
	question_three: String,
	question_four: String,
	question_five: String,
	user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Poll', pollSchema);


		