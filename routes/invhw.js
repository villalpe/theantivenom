'use strict'

var express = require('express');
var invoiceController = require('../controllers/invhw');

//Ahora usamos el router de express
var api = express.Router();
//Cargamos el middleware
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Para poder subir archivos, en este caso imagenes, ocupamos el middleware connect-multiparty
var mutlipart = require('connect-multiparty');
var md_upload = mutlipart({ uploadDir: './uploads/invoices' });

//Para pruebas del controlador
//A este metodo le paso el middleware con el token
api.get('/pruebas-invhw', md_auth.ensureAuth, invoiceController.pruebas);
//Para crear facturas
api.post('/invhw', [md_auth.ensureAuth, md_admin.isAdmin], invoiceController.saveInvHw);
//En get-invoices no hay la necesidad de usar autentificacion ya que queremos traer todos
api.get('/get-invhws', invoiceController.getInvHws);
api.get('/get-invhw/:id', invoiceController.getInvHw);
api.put('/update-invhw/:id', [md_auth.ensureAuth, md_admin.isAdmin], invoiceController.updateInvHw);
//api.post('/upload-image-invoice/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], invoiceController.uploadImageInvoice);
//api.get('/get-image-file-invoice/:imageFile', invoiceController.getImageFileInvoice);
api.delete('/delete-invhw/:id', [md_auth.ensureAuth, md_admin.isAdmin], invoiceController.deleteInvHw);

module.exports = api;