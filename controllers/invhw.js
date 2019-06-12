'use strict'

//Cargamos Modulos
//fs para manipular archivos
var fs = require('fs');
//para acceder a rutas de nuestro explorador de archivos
var path = require('path');

//Cargar modelos
var User = require('../models/user');
var InvHw = require('../models/invhw');

//Acciones
function pruebas(req, res){
	res.status(200).send({message: "Probando el controlador Invhw en metodo pruebas..."});
}

function saveInvHw(req, res){
	//Creamos objeto usuario
	var invhw = new InvHw();
	//Recoger parametros del body - peticion
	//body-parser ya lo convirtio a un json - lo podemos ver en Postman, body x-www-form-urlencoded
	var params = req.body;
	//console.log(params);
	if(params.name_fa){
		//Asignar valores al objeto usuario - setear
		invhw.name_fa = params.name_fa;
		invhw.type_fa = params.type_fa;
		invhw.impact = params.impact;
		invhw.location = params.location;
		invhw.manageby = params.manageby;
		invhw.depto = params.depto;
		invhw.year = params.year;
		invhw.month = params.month;
		invhw.status = params.status;
		invhw.usedby = params.usedby;
		invhw.etiq_fa = params.etiq_fa;
		//El req.user.sub viene del token creado jwt.js
		invhw.user = req.user.sub;

		invhw.save((err, invhwStored) => {
		if(err){
			return res.status(500).send({message: "No se pudo guardar el activo...error en el servidor"});
		}else{
			if(!invhwStored){
				return res.status(404).send({message: "Activo no registrado"});
			}else{
				return res.status(200).send({invhw: invhwStored});
				}
			}

		});
	}else{
		res.status(200).send({message: "Introduce el nombre de la activo correctamente..."});
	}
}

//Este metodo nos devuelve todos los invoices con el usuario que lo creo
function getInvHws(req, res){
	//Si paso json vacio  es que quiero todos los elementos de la bd
	InvHw.find({}).populate({path: 'user'}).exec((err, invhws) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!invhws){
				return res.status(404).send({message: 'No se encontraron activos'});
			}else{
				return res.status(200).send({invhws});
			}
		}
	});
}

//Metodo que nos devuelva una sola factura
function getInvHw(req, res){
	var invhwId = req.params.id;
	Invoice.findById(invhwId).populate({path: 'user'}).exec((err, invhw) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!invhw){
				return res.status(404).send({message: 'No se encontro el activo!'});
			}else{
				return res.status(200).send({invhw});
			}
		}	
	});

}

function updateInvHw(req, res){
	var invhwId = req.params.id;
	var update = req.body;

	Invhw.findByIdAndUpdate(invhwId, update, {new:true}, (err, invhwUpdated) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!invhwUpdated){
				return res.status(404).send({message: 'No se encontro el activo ha modificar!'});
			}else{
				return res.status(200).send({invhw: invhwUpdated});
			}
		}	
	});

}

/*function uploadImageInvHw(req, res){
	var invoiceId = req.params.id;
	var file_name = "No subido..";

	if(req.files.image){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
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

function getImageFileInvHw(req, res){
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
}*/

function deleteInvHw(req, res){
	var invhwId = req.params.id;

	Invhw.findOneAndDelete(invhwId, (err, invhwRemoved) => {
		if(err){
			return res.status(500).send({message: "Error al borrar la factura"});
		}else{
			if(!invhwRemoved){
				return res.status(404).send({message: "No se ha podido borrar el activo"});
			}else{
				return res.status(200).send({invhw: invhwRemoved});
			}
		}
	});

}

//Exportamos acciones
module.exports = {
	pruebas,
	saveInvHw,
	getInvHws,
	getInvHw,
	updateInvHw,
	//uploadImageInvoice,
	//getImageFileInvoice,
	deleteInvHw
};