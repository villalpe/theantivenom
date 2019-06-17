'use strict'

//Cargamos Modulos
//fs para manipular archivos
var fs = require('fs');
//para acceder a rutas de nuestro explorador de archivos
var path = require('path');

//Cargar modelos
var User = require('../models/user');
var Ufile = require('../models/uploadfile');

//Acciones

function pruebas(req, res){
	res.status(200).send({message: "Probando el controlador UploadFile en metodo pruebas...", user: req.user});
}

function saveUfile(req, res){
	//Creamos objeto usuario
	var ufile = new Ufile();
	//Recoger parametros del body - peticion
	//body-parser ya lo convirtio a un json - lo podemos ver en Postman, body x-www-form-urlencoded
	var params = req.body;
	//console.log(params);
	if(params.description){
		//Asignar valores al objeto usuario - setear
		ufile.description = params.description;
		ufile.year = params.year;
		ufile.month = params.month;
		ufile.fileu = null;
		//El req.user.sub viene del token creado jwt.js
		ufile.user = req.user.sub;

		ufile.save((err, ufileStored) => {
		if(err){
			return res.status(500).send({message: "No se pudo guardar el registro archivo...error en el servidor"});
		}else{
			if(!ufileStored){
				return res.status(404).send({message: "Archivo no registrado"});
			}else{
				return res.status(200).send({ufile: ufileStored});
				console.log(ufile);
				}
			}

		});
	}else{
		res.status(200).send({message: "Introduce el nombre del archivo correctamente..."});
	}
}

//Este metodo nos devuelve todos los archivos con el usuario que lo creo
function getUfiles(req, res){
	//var ufileId = req.params.id;
	//Si paso json vacio  es que quiero todos los elementos de la bd
	Ufile.find({}).populate({path: 'user'}).exec((err, ufiles) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!ufiles){
				return res.status(404).send({message: 'No se encontraron registros con archivos'});
			}else{
				return res.status(200).send({ufiles});
			}
		}
	});
}

function getUfileById(req, res){
	var ufileId = req.params.id;
	//Si paso json vacio  es que quiero todos los elementos de la bd
	Ufile.findById(ufileId, 'fileu', (err, ufile) => {
		if(err){
			return res.status(500).send({message: 'Error en la peticion...el servidor de BD no esta arriba'});
		}else{
			if(!ufile){
				return res.status(404).send({message: 'No se encontro archivo con ese ID'});
			}else{
				return res.status(200).send({ufile});
			}
		}
	});
}

function uploadFile(req, res){
	var ufileId = req.params.id;
	var file_name = "No subido..";

	if(req.files.fileu){
		var file_path = req.files.fileu.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_file = file_name.split('\.');
		var file_ext = ext_file[1];

		if(file_ext == 'jpg' || file_ext == 'pdf' || file_ext == 'doc' || file_ext == 'docx'){
			//Podemos poner como tercer parametro new:true para que nos muestre el registro actualizado
			Ufile.findByIdAndUpdate(ufileId, {fileu: file_name}, {new:true}, (err, ufileUpdated) => {
				if(err){
					return res.status(500).send({message: "Error al actualizar el archivo"});
				}else{
					if(!ufileUpdated){
						return res.status(404).send({message: "No se ha podido actualizar el archivo"});
					}else{
						return res.status(200).send({ufile: ufileUpdated, fileu: file_name});
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

function downloadFile(req, res){
	console.log(req.params);
	var ufileId = req.params.id;
	var file_name = req.params.fileu;
	//var file_name = "No subido..";

	if(req.params.fileu){
		var file_path = req.files.fileu.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[6];

		var ext_file = file_name.split('\.');
		var file_ext = ext_file[1];
		console.log(req.params.fileu);
		console.log(file_name);
		console.log(file_ext);

		if(file_ext == 'pdf' || file_ext == 'xml'){
			//Podemos poner como tercer parametro new:true para que nos muestre el registro actualizado
			Ufile.findById(ufileId, {fileu: file_name}, {new:true}, (err, ufile) => {
				if(err){
					return res.status(500).send({message: "Error al buscar el archivo"});
				}else{
					if(!ufile){
						return res.status(404).send({message: "No se ha podido encontrar el archivo"});
					}else{
						return res.status(200).send({fileu: file_name});
					}
				}
			});
		}else{
			//si tratamos de subir algun archivo que no sea de un archivo que no lo suba
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

function getFile(req, res){
	var nameFile = req.params.nameFile;
	//Vamos a acceder a la ruta fisica de la imagen, la ruta del disco duro
	var path_file = './uploads/files/'+nameFile;

	//Ahora comprobamos si el archivo existe
	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			return res.status(404).send({message: "El archivo no existe"});
		}
	});
}


//Exportamos acciones
module.exports = {
	saveUfile,
	getUfiles,
	getUfileById,
	uploadFile,
	downloadFile,
	getFile
};