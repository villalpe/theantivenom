var express = require('express');
var _router = express.Router();
var multer = require('multer');
var path = require('path');

/* GET home page. */
function testud(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.status(200).send({message: "Probando el controlador FileUD en metodo pruebas..."});
};


function upload(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads');
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+'.'+file.originalname);
    }
    });


    var upload = multer({storage:store}).single('file');

    upload(req,res,function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        //do all database record saving activity
        return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
    });
};


function download(req,res,next){
    console.log(req.body);
    filepath = path.join(__dirname,'../uploads') +'/'+ req.body.filename;
    res.sendFile(filepath);
};


module.exports = {
	testud,
	upload,
	download
}