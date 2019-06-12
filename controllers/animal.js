'use strict'

//Cargamos Modulos
//fs para manipular archivos
var fs = require('fs');
//para acceder a rutas de nuestro explorador de archivos
var path = require('path');

//Cargar modelos
var User = require('../models/user');
var Animal = require('../models/animal');

//Acciones
function pruebas(req, res){
	res.status(200).send({message: "Probando el controlador Animals en metodo pruebas...", user: req.user});
}

function saveAnimal(req, res){
	//Creamos objeto usuario
	var animal = new Animal();
	//Recoger parametros del body - peticion
	//body-parser ya lo convirtio a un json - lo podemos ver en Postman, body x-www-form-urlencoded
	var params = req.body;
	//console.log(params);
	if(params.name){
		//Asignar valores al objeto usuario - setear
		animal.name = params.name;
		animal.description = params.description;
		animal.year = params.year;
		animal.image = null;
		//El req.user.sub viene del token creado jwt.js
		animal.user = req.user.sub;

		animal.save((err, animalStored) => {
		if(err){
			return res.status(500).send({message: "No se pudo guardar el animal...error en el servidor"});
		}else{
			if(!animalStored){
				return res.status(404).send({message: "Animal no registrado"});
			}else{
				return res.status(200).send({animal: animalStored});
				}
			}

		});
	}else{
		res.status(200).send({message: "Introduce el nombre del animal correctamente..."});
	}
}

//Este metodo nos devuelve todos los animales con el usuario que lo creo
function getAnimals(req, res){
	//Si paso json vacio  es que quiero todos los elementos de la bd
	Animal.find({}).populate({path: 'user'}).exec((err, animals) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!animals){
				return res.status(404).send({message: 'No se encontraron animales'});
			}else{
				return res.status(200).send({animals});
			}
		}
	});
}

//Metodo que nos devuelva un solo animal
function getAnimal(req, res){
	var animalId = req.params.id;
	Animal.findById(animalId).populate({path: 'user'}).exec((err, animal) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!animal){
				return res.status(404).send({message: 'No se encontro el animal!'});
			}else{
				return res.status(200).send({animal});
			}
		}	
	});

}

function updateAnimal(req, res){
	var animalId = req.params.id;
	var update = req.body;

	Animal.findByIdAndUpdate(animalId, update, {new:true}, (err, animalUpdated) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!animalUpdated){
				return res.status(404).send({message: 'No se encontro el animal ha modificar!'});
			}else{
				return res.status(200).send({animal: animalUpdated});
			}
		}	
	});

}

function uploadImageAnimal(req, res){
	var animalId = req.params.id;
	var file_name = "No subido..";

	if(req.files.image){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_file = file_name.split('\.');
		var file_ext = ext_file[1];

		if(file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif'){
			//Podemos poner como tercer parametro new:true para que nos muestre el registro actualizado
			Animal.findByIdAndUpdate(animalId, {image: file_name}, {new:true}, (err, animalUpdated) => {
				if(err){
					return res.status(500).send({message: "Error al actualizar el animal"});
				}else{
					if(!animalUpdated){
						return res.status(404).send({message: "No se ha podido actualizar el animal"});
					}else{
						return res.status(200).send({animal: animalUpdated, image: file_name});
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

function getImageFileAnimal(req, res){
	var imageFile = req.params.imageFile;
	//Vamos a acceder a la ruta fisica de la imagen, la ruta del disco duro
	var path_file = './uploads/animals/'+imageFile;

	//Ahora comprobamos si el archivo existe
	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			return res.status(404).send({message: "La imagen no existe"});
		}
	});
}

function deleteAnimal(req, res){
	var animalId = req.params.id;

	Animal.findOneAndDelete(animalId, (err, animalRemoved) => {
		if(err){
			return res.status(500).send({message: "Error al borrar el animal"});
		}else{
			if(!animalRemoved){
				return res.status(404).send({message: "No se ha podido borrar el animal"});
			}else{
				return res.status(200).send({animal: animalRemoved});
			}
		}
	});

}

//Exportamos acciones
module.exports = {
	pruebas,
	saveAnimal,
	getAnimals,
	getAnimal,
	updateAnimal,
	uploadImageAnimal,
	getImageFileAnimal,
	deleteAnimal
};