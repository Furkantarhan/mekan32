var express = require('express');
var router = express.Router();

//anasayfayı yöneten metod
module.exports.hakkinda = function(req,res,next){
  res.render('hakkinda', 
  {title: 'Hakkında',
  'footer':'Furkan Tarhan 2020',
 });
}