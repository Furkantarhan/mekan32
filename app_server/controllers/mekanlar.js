var express = require('express');
var router = express.Router();
const anaSayfa = function (req, res, next) {
  res.render('mekanlar-liste',
    {
      'baslik': 'Anasayfa',
      'sayfaBaslik': {
        'siteAd': 'Mekan32',
        'aciklama': '  Isparta Civarında Mekanları Keşfedin :)'
      },
      'mekanlar': [
        {
          'ad': 'Starbucks',
          'adres': 'Centrum Garden',
          'puan': '4',
          'imkanlar': ['Kahve', 'Çay', 'Pasta'],
          'mesafe': '10km'
        },
        {
          'ad': 'Coffê Nero',
          'adres': 'Iyaş AVM',
          'puan': '4',
          'imkanlar': ['Internet', 'WC', 'Kahve'],
          'mesafe': '11km'
        },
        {
          'ad': 'Burç Fırın',
          'adres': 'Süleyman Demirel Caddesi',
          'puan': '5',
          'imkanlar': ['Kahvaltı', 'Çay', 'Pasta'],
          'mesafe': '10km'
        },
        {
          'ad': 'Uğur Pide',
          'adres': 'Sanayi Mahallesi',
          'puan': '5',
          'imkanlar': ['Pide', 'Kebap', 'Sucuk'],
          'mesafe': '22km'
        },
        {
          'ad': 'Edwards Coffee',
          'adres': 'Kafeler Sokağı',
          'puan': '4',
          'imkanlar': ['Kahve', 'Çay', 'Pasta'],
          'mesafe': '14km'
        },
        {
          'ad': 'Mackbear Coffee',
          'adres': '4504 Sokak',
          'puan': '2',
          'imkanlar': ['kahve', 'Wi-Fi', 'Pasta'],
          'mesafe': '8km'
        }     
      ]
    }
  );
}
const mekanBilgisi = function (req, res, next) {
  res.render('mekan-detay', { 
      'baslik':'Mekan Bilgisi',
      'sayfaBaslik':'Starbucks',
      'mekanBilgisi':{
        'ad':'Starbucks',
        'adres':'Centrum Garden',
        'puan':4,
        'imkanlar':['Kahve','Paste','Kek'],
        'koordinatlar':{
          'enlem':37.781885,
          'boylam':30.566034
        },
        'saatler':[
          {
             'gunler':'Pazartesi-Cuma',
             'acilis':'7.00',
             'kapanis':'23.00',
             'kapali':false
          },
          {
            'gunler':'Cumartesi',
            'acilis':'9.00',
            'kapanis':'22.30',
            'kapali':false
          },
          {
            'gunler':'Pazar',         
            'kapali':true
          }
      ],
      'yorumlar':[
          {
            'yorumYapan':'Furkan Tarhan',
            'puan':3,
            'tarih':'1 Aralık 2020',
            'yorumMetni':'Kahveler Enfessssss'
          },
          {
            'yorumYapan':'Utku Dericioğlu',
            'puan':5,
            'tarih':'2 Aralık 2020',
            'yorumMetni':'Buranın Kahveleri Harika!'
          }
       ]
    }
    
    
  });
}


const yorumEkle = function (req, res, next) {
  res.render('yorum-ekle', { title: 'Yorum Ekle' });
}

module.exports = {
  anaSayfa,
  mekanBilgisi,
  yorumEkle
}