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

//Cargar modelos
var User = require('../models/user');

//Acciones
function pruebas(req, res){
	res.status(200).send({message: "Probando el controlador usuario en metodo pruebas...", user: req.user});
}

function saveUser(req, res){
	//Creamos objeto usuario
	var user = new User();
	//Recoger parametros del body - peticion
	//body-parser ya lo convirtio a un json - lo podemos ver en Postman, body x-www-form-urlencoded
	var params = req.body;
	//console.log(params);
	if(params.password && params.name && params.surname && params.email){
		//Asignar valores al objeto usuario - setear
		user.name = params.name;
		user.surname = params.surname;
		user.num_emp = params.num_emp;
		user.depto = params.depto;
		user.email = params.email;
		if(user.depto == 'Finanzas'){
			user.role = "ROLE_FINANZAS";
		}else if (user.depto == 'RH'){
			user.role = "ROLE_RH";
		}else if (user.depto == 'Produccion'){
			user.role = "ROLE_PRODUCCION";
		}else if (user.depto == 'Calidad'){
			user.role = "ROLE_CALIDAD";
		}else if(user.depto == 'Ventas'){
			user.role = "ROLE_VENTAS";
		}else if(user.depto == 'Marketing'){
			user.role = "ROLE_MARKETING";
		}else if(user.depto == 'Compliance'){
			user.role = "ROLE_COMPLIANCE";
		}else if(user.depto == 'Asuntos Regulatorios'){
			user.role = "ROLE_AREGULATORIOS";
		}else if(user.depto == 'Direccion'){
			user.role = "ROLE_DIRECCION";
		}else if(user.depto == 'Sistemas'){
			user.role = "ROLE_SISTEMAS";
		}else{
			user.role = "ROLE_USER";
		}
		user.image = null;

		//Primero buscamos si antes de cifrar contraseña y guardar no existe el correo electronico de algun usuario ya guardado
		User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
			if(err){
				return res.status(500).send({message: "Error al comprobar el usuario"});
			}else{
				if(!issetUser){
					//Ciframos la contraseña
						bcrypt.hash(params.password, null, null, (err, hash) => {
						//pasamos a user.password ya la contraseña cifrada
						user.password = hash;
						//Guardo usuario en BD
						user.save((err, userStored) => {
							if(err){
								return res.status(500).send({message: "No se pudo guardar usuario"});
							}else{
								if(!userStored){
									return res.status(404).send({message: "No se registrado el usuario"});
								}else{
									return res.status(200).send({user: userStored});
								}
							}
						});
					});
				}else{
					return res.status(200).send({message: "El usuario no puede regsitrarse"})
				}
			}

		});

	}else{
		res.status(200).send({message: "Introduce los datos del usuario correctamente"});
	}
}

function login(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			return res.status(500).send({message: "Error al comprobar si existe usuario"});
		}else{
			if(user){
				bcrypt.compare(password, user.password, (err, check) => {
					if(check){
						//Checamos si gettoken, si, trae y genera el token, no, manda el user
						if(params.gettoken){
							return res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							return res.status(200).send({user});
						}
					}else{
						return res.status(404).send({message: "El usuario no ha podido logearse correctamente por la contraseña incorrecta"});
					}
				});
			}else{
				return res.status(404).send({message: "El usuario con ese correo no existe en la BD"});
			}
		}

	});

}

function updateUser(req, res){
		//params: son los parametros que llegan por la url
		var userId = req.params.id;
		//body: son los datos que llegan por el body o data
		var update = req.body;
		//Queremos borrar la contraseña password porque no la vamos a cambiar al actualizar
		delete update.password;

		//req.user.sub viene del payload	
		if(userId != req.user.sub){
			return res.status(500).send({message: "No tienes permiso para actualizar el usuario"});
		}
		//Podemos poner como tercer parametro new:true para que nos muestre el registro actualizado
		User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
			if(err){
				return res.status(500).send({message: "Error al actualizar el usuario"});
			}else{
				if(!userUpdated){
					return res.status(404).send({message: "No se ha podido actualizar el usuario"});
				}else{
					return res.status(200).send({user: userUpdated});
				}
			}
		});
}

function uploadImageUser(req, res){
	var userId = req.params.id;
	var file_name = "No subido..";

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_file = file_name.split('\.');
		var file_ext = ext_file[1];

		if(file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif'){
			//req.user.sub viene del payload	
			//if(userId != req.user.sub){
			//	console.log(req.user.sub);
			//	console.log(userId);
			//	return res.status(500).send({message: "No tienes permiso para actualizar el usuario"});
			//}
			//Podemos poner como tercer parametro new:true para que nos muestre el registro actualizado
			//console.log(userId);
			User.findOneAndUpdate({ _id: req.params.id }, {image: file_name}, {new:true}, (err, userUpdated) => {
				if(err){
					return res.status(500).send({message: "Error al actualizar el usuario"});
				}else{
					if(!userUpdated){
						//console.log(userId);
						//console.log(userUpdated);
						return res.status(404).send({message: "No se ha podido actualizar el usuario"});
					}else{
						//console.log(userId);
						//console.log(userUpdated);
						return res.status(200).send({user: userUpdated, image: file_name});
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

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	//Vamos a acceder a la ruta fisica de la imagen, la ruta del disco duro
	var path_file = './uploads/users/'+imageFile;

	//Ahora comprobamos si el archivo existe
	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			return res.status(404).send({message: "La imagen no existe"});
		}
	});
}

function getKeepers(req, res){
	User.find({role: 'ROLE_ADMIN'}).exec((err, users) => {
		if(err){
			return res.status(500).send({message: "Error en la peticion"});
		}else{
			if(!users){
				return res.status(404).send({message: "Metodo Get Keepers"});
			}else{
				return res.status(200).send({users});
			}
		}
	});

}

//Exportamos acciones
module.exports = {
	pruebas,
	saveUser,
	login,
	updateUser,
	uploadImageUser,
	getImageFile,
	getKeepers
};