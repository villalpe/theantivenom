'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');
var invoice_routes = require('./routes/invoice');
var poll_routes = require('./routes/poll');
var uploadfile_routes = require('./routes/uploadfile');
var fileud_routes = require('./routes/fileud');
var invhw_routes = require('./routes/invhw');
var asaldos_routes = require('./routes/asaldo');

//var appRoutes = require('./routes/app');
//var fileRoutes = require('./routes/file');

//middleware de body-parser
app.use(bodyParser.urlencoded({extended: false}));
//Convertir lo que traiga el body a json
app.use(bodyParser.json());

//Configurar cabeceras y cors
/*app.use((req, res, next) => {
	//res.header('Access-Control-Allow-Origin', '*');
	//res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
	res.setHeader('Access-Control-Allow-Origin' '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas base
app.use('/', express.static('client', {redirect: false}));
app.use('/api', user_routes);
app.use('/api', animal_routes);
app.use('/api', invoice_routes);
app.use('/api', poll_routes);
app.use('/api', uploadfile_routes);
app.use('/api', fileud_routes);
app.use('/api', invhw_routes);
app.use('/api', asaldos_routes);

app.get('*', function(req,res,next) {
    res.sendFile(path.resolve('client/index.html'));
});

//app.use('/file',fileRoutes);
//app.use('/', appRoutes);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
  
//  next();
//});

//Exportar modulo
module.exports = app;

