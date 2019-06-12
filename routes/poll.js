'use strict'

var express = require('express');
var pollController = require('../controllers/poll');

//Ahora usamos el router de express
var api = express.Router();
//Cargamos el middleware
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Para poder subir archivos, en este caso imagenes, ocupamos el middleware connect-multiparty
var mutlipart = require('connect-multiparty');
var md_upload = mutlipart({ uploadDir: './uploads/polls' });

//Para pruebas del controlador
//A este metodo le paso el middleware con el token
api.get('/pruebas-polls', md_auth.ensureAuth, pollController.pruebas);
//Para crear Encuestas
//api.post('/poll', [md_auth.ensureAuth], pollController.savePoll);
api.post('/poll', [md_auth.ensureAuth, md_admin.isAdmin], pollController.savePoll);
//En get-invoices no hay la necesidad de usar autentificacion ya que queremos traer todos
api.get('/get-polls', pollController.getPolls);
api.get('/get-poll/:id', pollController.getPoll);
api.put('/update-poll/:id', [md_auth.ensureAuth, md_admin.isAdmin], pollController.updatePoll);
//api.post('/upload-image-invoice/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], invoiceController.uploadImageInvoice);
//api.get('/get-image-file-invoice/:imageFile', invoiceController.getImageFileInvoice);
api.delete('/delete-poll/:id', [md_auth.ensureAuth, md_admin.isAdmin], pollController.deletePoll);

module.exports = api;