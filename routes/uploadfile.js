'use strict'

var express = require('express');
var uloadfController = require('../controllers/uploadfile');

//Ahora usamos el router de express
var api = express.Router();
//Cargamos el middleware
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Para poder subir archivos, en este caso imagenes, ocupamos el middleware connect-multiparty
var mutlipart = require('connect-multiparty');
var md_upload = mutlipart({ uploadDir: './uploads/files' });
var md_download = mutlipart({ downloadDir: './download/files'})

//Para pruebas del controlador
//A este metodo le paso el middleware con el token
//api.get('/pruebas-animales', md_auth.ensureAuth, animalController.pruebas);
//Para crear animales
api.post('/saveufile', [md_auth.ensureAuth, md_admin.isAdmin], uloadfController.saveUfile);
//En get-animals no hay la necesidad de usar autentificacion ya que queremos traer todos
api.get('/getufiles', uloadfController.getUfiles);
api.get('/getufile/:id', uloadfController.getUfileById);
//api.get('/get-animal/:id', animalController.getAnimal);
//api.put('/update-animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.updateAnimal);
api.post('/upload-file/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], uloadfController.uploadFile);
api.post('/download-file/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_download], uloadfController.downloadFile);
api.get('/get-file/:nameFile', uloadfController.getFile);
//api.get('/get-file/:imageFile', animalController.getImageFileAnimal);
//api.delete('/delete-animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.deleteAnimal);

module.exports = api;