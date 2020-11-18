var express = require('express');
var router = express.Router();

//anasayfayı yöneten metod
module.exports.index = function(req,res,next){
  res.render('index', {title: 'Furkan'});
}
