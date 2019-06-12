'use strict'

var express = require('express');
var fileudController = require('../controllers/fileud');

//Ahora usamos el router de express
var api = express.Router();
//Cargamos el middleware
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Para poder subir archivos, en este caso imagenes, ocupamos el middleware connect-multiparty
var mutlipart = require('connect-multiparty');
var md_upload = mutlipart({ uploadDir: './uploads/files' });

//Para pruebas del controlador
//A este metodo le paso el middleware con el token
//api.get('/pruebas-animales', md_auth.ensureAuth, animalController.pruebas);
//Para crear animales
//api.post('/saveufile', [md_auth.ensureAuth, md_admin.isAdmin], fileudController.saveUfile);
//En get-animals no hay la necesidad de usar autentificacion ya que queremos traer todos
api.get('/pruebas', fileudController.testud);
//api.get('/get-animal/:id', animalController.getAnimal);
//api.put('/update-animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.updateAnimal);
//api.post('/upload-file/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], fileudController.uploadFile);
//api.get('/get-file/:imageFile', animalController.getImageFileAnimal);
//api.delete('/delete-animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.deleteAnimal);
api.post('/uploadf', fileudController.upload);
api.post('/downloadf', fileudController.download);

module.exports = api;