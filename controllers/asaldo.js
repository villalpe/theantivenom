'use strict'
//Cargamos Modulos
//bcrypt para cifrar contraseñas
var bcrypt = require('bcrypt-nodejs');
//fs para manipular archivos
var fs = require('fs');
//para acceder a rutas de nuestro explorador de archivos
var path = require('path');

//importar servicio de jwt y luego lo ponemos en el metodo login
var jwt = require('../services/jwt');

var csv = require('fast-csv');
var mongoose = require('mongoose');
var Asaldo = require('../models/asaldo');

//Acciones
function pruebas(req, res){
	res.status(200).send({message: "Probando el controlador Antiguedad de Saldos en metodo pruebas..."});
}

function uploadCsv (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var asaldoFile = req.files.file;
 
    var asaldos = [];
         
    csv
     .fromString(asaldoFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         data['_id'] = new mongoose.Types.ObjectId();
          
         asaldos.push(data);
     })
     .on("end", function(){
         Asaldo.create(asaldos, function(err, documents) {
            if (err) throw err;
         });
          
         res.send(asaldos.length + ' Antiguedad de Saldos have been successfully uploaded.');
     });
};

 function getAsaldos (req, res) {
//Este metodo nos devuelve todos los invoices con el usuario que lo creo
//Si paso json vacio  es que quiero todos los elementos de la bd
	Asaldo.find({}).populate().exec((err, invoices) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!invoices){
				return res.status(404).send({message: 'No se encontraron facturas'});
			}else{
				return res.status(200).send({invoices});
			}
		}
	});
}

module.exports = {
	pruebas,
	uploadCsv,
	getAsaldos
};