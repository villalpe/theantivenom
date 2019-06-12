'use strict'

//Cargamos Modulos
//fs para manipular archivos
var fs = require('fs');
//para acceder a rutas de nuestro explorador de archivos
var path = require('path');

//Cargar modelos
var User = require('../models/user');
var Invoice = require('../models/invoice');

//Acciones
function pruebas(req, res){
	res.status(200).send({message: "Probando el controlador Invoices en metodo pruebas...", user: req.user});
}

function saveInvoice(req, res){
	//Creamos objeto usuario
	var invoice = new Invoice();
	//Recoger parametros del body - peticion
	//body-parser ya lo convirtio a un json - lo podemos ver en Postman, body x-www-form-urlencoded
	var params = req.body;
	//console.log(params);
	if(params.name_provider){
		//Asignar valores al objeto usuario - setear
		invoice.name_provider = params.name_provider;
		invoice.address_provider = params.address_provider;
		invoice.invoice_number = params.invoice_number;
		invoice.description = params.description;
		invoice.quantity = params.quantity;
		invoice.total = params.total;
		invoice.year = params.year;
		invoice.month = params.month;
		invoice.status = params.status;
		invoice.image = null;
		//El req.user.sub viene del token creado jwt.js
		invoice.user = req.user.sub;

		invoice.save((err, invoiceStored) => {
		if(err){
			return res.status(500).send({message: "No se pudo guardar la factura...error en el servidor"});
		}else{
			if(!invoiceStored){
				return res.status(404).send({message: "Factura no registrada"});
			}else{
				return res.status(200).send({invoice: invoiceStored});
				}
			}

		});
	}else{
		res.status(200).send({message: "Introduce el nombre de la factura correctamente..."});
	}
}

//Este metodo nos devuelve todos los invoices con el usuario que lo creo
function getInvoices(req, res){
	//Si paso json vacio  es que quiero todos los elementos de la bd
	Invoice.find({}).populate({path: 'user'}).exec((err, invoices) => {
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

//Metodo que nos devuelva una sola factura
function getInvoice(req, res){
	var invoiceId = req.params.id;
	Invoice.findById(invoiceId).populate({path: 'user'}).exec((err, invoice) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!invoice){
				return res.status(404).send({message: 'No se encontro la factura!'});
			}else{
				return res.status(200).send({invoice});
			}
		}	
	});

}

function updateInvoice(req, res){
	var invoiceId = req.params.id;
	var update = req.body;

	Invoice.findByIdAndUpdate(invoiceId, update, {new:true}, (err, invoiceUpdated) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!invoiceUpdated){
				return res.status(404).send({message: 'No se encontro la factura ha modificar!'});
			}else{
				return res.status(200).send({invoice: invoiceUpdated});
			}
		}	
	});

}

function uploadImageInvoice(req, res){
	var invoiceId = req.params.id;
	var file_name = "No subido..";

	if(req.files.image){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_file = file_name.split('\.');
		var file_ext = ext_file[1];

		if(file_ext == 'pdf' || file_ext == 'doc' || file_ext == 'docx'){
			//Podemos poner como tercer parametro new:true para que nos muestre el registro actualizado
			Invoice.findByIdAndUpdate(invoiceId, {image: file_name}, {new:true}, (err, invoiceUpdated) => {
				if(err){
					return res.status(500).send({message: "Error al actualizar la factura"});
				}else{
					if(!invoiceUpdated){
						return res.status(404).send({message: "No se ha podido actualizar la factura"});
					}else{
						return res.status(200).send({invoice: invoiceUpdated, image: file_name});
					}
				}
			});
		}else{
			//si tratamos de subir algun archivo que no sea de una imagen que no lo suba
			fs.unlink(file_path, (err) => {
				if(err){
					return res.status(200).send({message: "Extension no es valida y archivo no borrado"});
				}else{
					return res.status(200).send({message: "Extension no es valida!"});
				}
			});
		}
	}else{
		return res.status(200).send({message: "No se ha subido archivo!"});
	}
}

function getImageFileInvoice(req, res){
	var imageFile = req.params.imageFile;
	//Vamos a acceder a la ruta fisica de la imagen, la ruta del disco duro
	var path_file = './uploads/invoices/'+imageFile;

	//Ahora comprobamos si el archivo existe
	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			return res.status(404).send({message: "La imagen no existe"});
		}
	});
}

function deleteInvoice(req, res){
	var invoiceId = req.params.id;

	Invoice.findOneAndDelete(invoiceId, (err, invoiceRemoved) => {
		if(err){
			return res.status(500).send({message: "Error al borrar la factura"});
		}else{
			if(!animalRemoved){
				return res.status(404).send({message: "No se ha podido borrar la factura"});
			}else{
				return res.status(200).send({invoice: invoiceRemoved});
			}
		}
	});

}

//Exportamos acciones
module.exports = {
	pruebas,
	saveInvoice,
	getInvoices,
	getInvoice,
	updateInvoice,
	uploadImageInvoice,
	getImageFileInvoice,
	deleteInvoice
};