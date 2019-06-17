var mongoose = require('mongoose');
 
var asaldoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    num_prov: Number,
    nombre_prov: String,
    saldo: mongoose.Schema.Types.Decimal128,
    alcorr: mongoose.Schema.Types.Decimal128,
    d130: mongoose.Schema.Types.Decimal128,
    d3160: mongoose.Schema.Types.Decimal128,
    d6190: mongoose.Schema.Types.Decimal128,
    d91m: mongoose.Schema.Types.Decimal128,
    mes: Number,
    ano: Number,
});
 
var Asaldo = mongoose.model('Asaldo', asaldoSchema);
 
module.exports = Asaldo;