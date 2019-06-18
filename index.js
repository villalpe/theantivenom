'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3050;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo', { useNewUrlParser: true }, (err, res) => {
	if(err){
		throw(err);
	}else {
		console.log("La conexion a la BD Zoo se ha realizado correctamente..");
		app.listen(port, () => {
			console.log("El servidor con NodeJs y express en el puerto 3050 esta corriendo correctamente...");
		});
	}
});
