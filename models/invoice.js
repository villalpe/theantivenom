'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoiceSchema = Schema({
	name_provider: String,
	address_provider: String,
	invoice_number: String,
	description: String,
	quantity: Number,
	total: Number,
	year: Number,
	month: Number,
	status: Boolean,
	image: String,
	user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
