var express = require('express');
var router = express.Router();

var request = require('postman-request');
var footer = "Furkan Tarhan 2020"

var apiSecenekleri = {
  sunucu: "https://muharremfurkantarhan1721012005.herokuapp.com/",
  apiYolu: "/api/mekanlar/"
}
var istekSecenekleri

var mesafeyiFormatla = function (mesafe) {
  var yeniMesafe, birim;
  if (mesafe > 1000) {
    yeniMesafe = parseFloat(mesafe / 1000).toFixed(2);
    birim = ' km';
  } else {
    yeniMesafe = parseFloat(mesafe).toFixed(1);
    birim = 'm';
  }
  return yeniMesafe + birim;
}

var anaSayfaOlustur = function (req, res, cevap, mekanListesi) {
  var mesaj;
  try {
    if (!(mekanListesi instanceof Array)) {
      mesaj = "API HATASI: Bir şeyler ters gitti :(";
      mekanListesi = [];
    } else {
      if (!mekanListesi.length) {
        mesaj = "Civarda Herhangi Bir Mekan Bulunamadı!";
      }
    }
    res.render('mekanlar-liste',
      {
        baslik: 'Mekan32',
        sayfaBaslik: {
          siteAd: 'Mekan32',
          aciklama: 'Isparta Civarındaki Mekanları Keşfedin :)'
        },
        footer: footer,
        mekanlar: mekanListesi,
        mesaj: mesaj,
        cevap: cevap
      });
  } catch (err) {
    console.log(err)
  }

}

const anaSayfa = function (req, res) {

  try {
    istekSecenekleri =
    {
      url: apiSecenekleri.sunucu + apiSecenekleri.apiYolu,
      method: "GET",
      json: {},

      qs: {
        enlem: req.query.enlem,
        boylam: req.query.boylam
      }
    };
    console.log(istekSecenekleri)
    request(
      istekSecenekleri,
      function (hata, cevap, mekanlar) {
        var i, gelenMekanlar;
        gelenMekanlar = mekanlar;

        if (!hata && gelenMekanlar.length) {
          for (i = 0; i < gelenMekanlar.length; i++) {
            gelenMekanlar[i].mesafe =
              mesafeyiFormatla(gelenMekanlar[i].mesafe);
          }
        }
        anaSayfaOlustur(req, res, cevap, gelenMekanlar);
      }
    );
  } catch (err) {
    console.log(err)
  }

}

var detaySayfasiOlustur = function (req, res, mekanDetaylari) {
  res.render('mekan-detay',
    {
      baslik: mekanDetaylari.ad,
      footer: footer,
      sayfaBaslik: mekanDetaylari.ad,
      mekanBilgisi: mekanDetaylari
    });
}

var hataGoster = function (req, res, durum) {
  var baslik, icerik;
  if (durum == 404) {
    baslik = "404, Sayfa Bulunamadı!";
    icerik = "Üzgünüz Aradığınız şeyi Bulamadık :(";
  }
  else {
    baslik = durum + ", Bir şeyler ters gitti :(";
    icerik = "Ters giden bir şey var :(";
  }
  res.status(durum);
  res.render('hata', {
    baslik: baslik,
    icerik: icerik,

  });
};

var mekanBilgisiGetir = function (req, res, callback){
  var istekSecenekleri;

  istekSecenekleri = {
    url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid,

    method : "GET",
    json : {}
  };
  request(
    istekSecenekleri,
        function(hata, cevap, mekanDetaylari){
          var gelenMekan = mekanDetaylari;
          if(cevap.statusCode==200) {
            gelenMekan.koordinatlar = {
              enlem : mekanDetaylari.koordinatlar[0],
              boylam : mekanDetaylari.koordinatlar[1]
            };
            callback(req, res,gelenMekan);
          } else {
            hataGoster(req, res, cevap.statusCode);
          }
        }

  );

};

  const mekanBilgisi = function(req, res, callback) {
  mekanBilgisiGetir(req , res , function(req , res , cevap){
   detaySayfasiOlustur(req , res , cevap);
  });
 };
 



  var yorumSayfasiOlustur = function (req, res, mekanBilgisi) {
  res.render('yorum-ekle', { 
     baslik: mekanBilgisi.ad + 'Mekanına Yorum Ekle',
     sayfaBaslik: mekanBilgisi.ad + 'Mekanına Yorum Ekle' ,
     hata: req.query.hata
});
};


   const yorumEkle = function(req , res) {
    mekanBilgisiGetir(req , res , function(req , res , cevap){
      yorumSayfasiOlustur(req , res , cevap);
    }
      )
    }
  
   const yorumumuEkle=function(req,res){
    var istekSecenekleri, gonderilenYorum,mekanid;
    mekanid=req.params.mekanid;
    gonderilenYorum = {
      yorumYapan: req.body.name,
      puan: parseInt(req.body.rating, 10),
      yorumMetni: req.body.review
    };
    istekSecenekleri = {
      url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu + mekanid +'/yorumlar',
      method : "POST",
      json : gonderilenYorum
    };
    if (!gonderilenYorum.yorumYapan || !gonderilenYorum.puan || !gonderilenYorum.yorumMetni){
      res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet');
} else {
  request(
    istekSecenekleri,
    function(hata, cevap, body){
      if (cevap.statusCode === 201) {
        res.redirect('/mekan/' + mekanid);

      }
      else if (cevap.statusCode === 400 && body.name && body.name ==="ValidationError") {
        res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet');
      }
      else {
        hataGoster(req, res, cevap.statusCode);
      }
    }
      );
    }
  
};
module.exports = {
  anaSayfa,
  mekanBilgisi,
  yorumEkle,
  yorumumuEkle
};
// var express = require('express');
// var router = express.Router();
// const anaSayfa = function (req, res, next) {
//   res.render('mekanlar-liste',
//     {
//       'baslik': 'Anasayfa',
//       'footer': 'Furkan Tarhan 2020',
//       'sayfaBaslik': {
//         'siteAd': 'Mekan32',
//         'aciklama': '  Isparta Civarında Mekanları Keşfedin :)'
//       },
//       'mekanlar': [
//         {
//           'ad': 'Starbucks',
//           'adres': 'Centrum Garden',
//           'puan': '4',
//           'imkanlar': ['Kahve', 'Çay', 'Pasta'],
//           'mesafe': '10km'
//         },
//         {
//           'ad': 'Coffê Nero',
//           'adres': 'Iyaş AVM',
//           'puan': '4',
//           'imkanlar': ['Internet', 'WC', 'Kahve'],
//           'mesafe': '11km'
//         },
//         {
//           'ad': 'Burç Fırın',
//           'adres': 'Süleyman Demirel Caddesi',
//           'puan': '5',
//           'imkanlar': ['Kahvaltı', 'Çay', 'Pasta'],
//           'mesafe': '10km'
//         },
//         {
//           'ad': 'Uğur Pide',
//           'adres': 'Sanayi Mahallesi',
//           'puan': '5',
//           'imkanlar': ['Pide', 'Kebap', 'Sucuk'],
//           'mesafe': '22km'
//         },
//         {
//           'ad': 'Edwards Coffee',
//           'adres': 'Kafeler Sokağı',
//           'puan': '4',
//           'imkanlar': ['Kahve', 'Çay', 'Pasta'],
//           'mesafe': '14km'
//         },
//         {
//           'ad': 'Mackbear Coffee',
//           'adres': '4504 Sokak',
//           'puan': '2',
//           'imkanlar': ['kahve', 'Wi-Fi', 'Pasta'],
//           'mesafe': '8km'
//         }
//       ]
//     }
//   );
// }
// const mekanBilgisi = function (req, res, next) {
//   res.render('mekan-detay', {
//     'baslik': 'Mekan Bilgisi',
//     'footer': 'Furkan Tarhan 2020',
//     'sayfaBaslik': 'Starbucks',
//     'mekanBilgisi': {
//       'ad': 'Starbucks',
//       'adres': 'Centrum Garden',
//       'puan': 4,
//       'imkanlar': ['Kahve', 'Paste', 'Kek'],
//       'koordinatlar': {
//         'enlem': 37.781885,
//         'boylam': 30.566034
//       },
//       'saatler': [
//         {
//           'gunler': 'Pazartesi-Cuma',
//           'acilis': '7.00',
//           'kapanis': '23.00',
//           'kapali': false
//         },
//         {
//           'gunler': 'Cumartesi',
//           'acilis': '9.00',
//           'kapanis': '22.30',
//           'kapali': false
//         },
//         {
//           'gunler': 'Pazar',
//           'kapali': true
//         }
//       ],
//       'yorumlar': [
//         {
//           'yorumYapan': 'Furkan Tarhan',
//           'puan': 3,
//           'tarih': '1 Aralık 2020',
//           'yorumMetni': 'Kahveler Enfessssss'
//         },
//         {
//           'yorumYapan': 'Utku Dericioğlu',
//           'puan': 5,
//           'tarih': '2 Aralık 2020',
//           'yorumMetni': 'Buranın Kahveleri Harika!'
//         }
//       ]
//     }


//   });
// }


// const yorumEkle = function (req, res, next) {
//   res.render('yorum-ekle', {
//     title: 'Yorum Ekle',
//     'footer': 'Furkan Tarhan 2020',
//   });
// }

// module.exports = {
//   anaSayfa,
//   mekanBilgisi,
//   yorumEkle
// }