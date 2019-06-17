'use strict'

var express = require('express');
var asaldoController = require('../controllers/asaldo');

//Ahora usamos el router de express
var api = express.Router();
//Cargamos el middleware
var md_auth = require('../middlewares/authenticated');

//Para poder subir archivos, en este caso imagenes, ocupamos el middleware connect-multiparty
var mutlipart = require('connect-multiparty');
var md_upload = mutlipart({ uploadDir: './uploads/users' });

//Para pruebas del controlador
//A este metodo le paso el middleware con el token
api.get('/pruebas-csv', md_auth.ensureAuth, asaldoController.pruebas);
//Para registro de Usuario - guardar - se usa metodo post
api.post('/uploadcsv', asaldoController.uploadCsv);
api.get('/get-asaldos', asaldoController.getAsaldos);

module.exports = api;