'use strict'

//Cargamos Modulos
//fs para manipular archivos
var fs = require('fs');
//para acceder a rutas de nuestro explorador de archivos
var path = require('path');

//Cargar modelos
var User = require('../models/user');
var Poll = require('../models/poll');

//Acciones
function pruebas(req, res){
	res.status(200).send({message: "Probando el controlador Encuestas en metodo pruebas...", user: req.user});
}

function savePoll(req, res){
	//Creamos objeto usuario
	var poll = new Poll();
	//Recoger parametros del body - peticion
	//body-parser ya lo convirtio a un json - lo podemos ver en Postman, body x-www-form-urlencoded
	var params = req.body;
	//console.log(params);
	if(req.user.sub){
		//Asignar valores al objeto usuario - setear
		poll.question_one = params.question_one;
		poll.question_two = params.question_two;
		poll.question_three = params.question_three;
		poll.question_four = params.question_four;
		poll.question_five = params.question_five;
		//El req.user.sub viene del token creado jwt.js
		poll.user = req.user.sub;
		console.log(req.user.sub);

		poll.save((err, pollStored) => {
		if(err){
			return res.status(500).send({message: "No se pudo guardar la encuesta...error en el servidor"});
		}else{
			if(!pollStored){
				return res.status(404).send({message: "Encuesta no registrada"});
			}else{
				return res.status(200).send({poll: pollStored});
				}
			}

		});
	}else{
		res.status(200).send({message: "Introduce el nombre de la encuesta correctamente..."});
	}
}

//Este metodo nos devuelve todos los invoices con el usuario que lo creo
function getPolls(req, res){
	//Si paso json vacio  es que quiero todos los elementos de la bd
	Poll.find({}).populate({path: 'user'}).exec((err, polls) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!polls){
				return res.status(404).send({message: 'No se encontraron Encuestas'});
			}else{
				return res.status(200).send({polls});
			}
		}
	});
}

//Metodo que nos devuelva una sola factura
function getPoll(req, res){
	var pollId = req.params.id;
	Poll.findById(pollId).populate({path: 'user'}).exec((err, poll) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!poll){
				return res.status(404).send({message: 'No se encontro la Encuesta!'});
			}else{
				return res.status(200).send({poll});
			}
		}	
	});

}

function updatePoll(req, res){
	var pollId = req.params.id;
	var update = req.body;

	Invoice.findByIdAndUpdate(pollId, update, {new:true}, (err, pollUpdated) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!animalUpdated){
				return res.status(404).send({message: 'No se encontro la Encuesta ha modificar!'});
			}else{
				return res.status(200).send({poll: pollUpdated});
			}
		}	
	});

}

/*function uploadImageInvoice(req, res){
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
}*/

/*function getImageFileInvoice(req, res){
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

function deletePoll(req, res){
	var pollId = req.params.id;

	Poll.findOneAndDelete(pollId, (err, pollRemoved) => {
		if(err){
			return res.status(500).send({message: "Error al borrar la Encuesta"});
		}else{
			if(!animalRemoved){
				return res.status(404).send({message: "No se ha podido borrar la Encuesta"});
			}else{
				return res.status(200).send({poll: pollRemoved});
			}
		}
	});

}

//Exportamos acciones
module.exports = {
	pruebas,
	savePoll,
	getPolls,
	getPoll,
	updatePoll,
	deletePoll
};