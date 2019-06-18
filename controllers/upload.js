var csv = require('fast-csv');
var mongoose = require('mongoose');
var Asaldo = require('../models/asaldo');
 
exports.post = function (req, res) {
    if (!req.files)
        return res.status(400).send('No Archivos se han cargado.');
     
    var asaldoFile = req.files.file;
 
    var asaldos = [];
         
    csv
     .fromString(asaldoFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         data['_id'] = new mongoose.Types.ObjectId();
          
         asaldos.push(data);
     })
     .on("end", function(){
         Asaldo.create(asaldos, function(err, documents) {
            if (err) throw err;
         });
          
         res.send(asaldos.length + ' Antiguedad de Saldos have been successfully uploaded.');
     });
};