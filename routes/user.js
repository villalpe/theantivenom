'use strict'

var express = require('express');
var userController = require('../controllers/user');

//Ahora usamos el router de express
var api = express.Router();
//Cargamos el middleware
var md_auth = require('../middlewares/authenticated');

//Para poder subir archivos, en este caso imagenes, ocupamos el middleware connect-multiparty
var mutlipart = require('connect-multiparty');
var md_upload = mutlipart({ uploadDir: './uploads/users' });

//Para pruebas del controlador
//A este metodo le paso el middleware con el token
api.get('/pruebas-del-controlador', md_auth.ensureAuth, userController.pruebas);
//Para registro de Usuario - guardar - se usa metodo post
api.post('/register', userController.saveUser);
api.post('/login' , userController.login);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
//A esta ruta le paso dos middleware en un arreglo
//api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImageUser);
api.post('/upload-image-user/:id', [md_upload], userController.uploadImageUser);
api.get('/get-image-file/:imageFile', userController.getImageFile);
api.get('/get-keepers', userController.getKeepers);

module.exports = api;