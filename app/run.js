var argv = require('yargs').argv,
  util = require('util'),
  _ = require('underscore'),
  fs = require('fs'),
  Q = require('q'),
  async = require('async'),
  Krawler = require('krawler'),
  IPartsCrawler = require('./iparts-crawler');


var mongoskin = require('mongoskin');
var mongo = mongoskin.db("mongodb://localhost:27017/iparts");

var ipartsCrawler = new IPartsCrawler(mongo);
ipartsCrawler.setMaxListeners(0);


ipartsCrawler
  .on('urlFetched', function(url) {
    util.log('URL fetched: ' + url);
  })
  .on('detailFetched', function(url) {
    util.log('Detail fetched: ' + url);
  })
  .on('productSaved', function(name) {
    util.log('Product saved: ' + name);
  });

if(argv.test) {

  ipartsCrawler
    .findLinksInCatalog("http://www.iparts.pl/auto-czesci/filtr-hydrauliczny,iveco,eurocargo-od-1991-01,100-e-15-143km,55-3421-1694-100262.html")
    .then(function(result) {
      console.log(result);
    })
    .done(process.exit);
}


else if(argv.start) {

  ipartsCrawler
    .findLinksInHomepage(argv.url)

    .then(function(urls) {

      var deferred = Q.defer();
      var newUrls = [];

      async.eachLimit(urls, 1, function(url, callback) {

        ipartsCrawler
          .findLinksInParts(url)
          .then(function(urls) {

            async.eachLimit(urls, 10, function(url, callback) {
              ipartsCrawler
                .findProducts(url)
                .then(function(products) {
                  var deferred = Q.defer();

                  async.each(products, function(product, callback) {
                    ipartsCrawler
                      .saveProduct(product)
                      .fin(callback);
                  }, function(err) {
                    deferred.resolve()
                  });

                  return deferred.promise;

                })
                .fin(callback);
            });
          })

          .fin(callback);

      }, function(err) {
        if(err) deferred.reject(err);
        else    deferred.resolve(newUrls);
      });

      return deferred.promise;
    })
    .done(process.exit);

}


else if(argv.export) {

  var handle = function(items) {

    var products = {};

    var data = [
      '"categories"',
      '"name"',
      '"brand"',
      '"productId"',
      '"description"',
      '"price"',
      '"image"',
      '"_id"'
    ];

    fs.appendFileSync(__dirname + '/export.csv', data.join(';') + "\n");

    items.forEach(function(i, k) {

      var categories = i.categories.split('|');
      categories.splice(0, 2);
      categories = categories.map(function(i) {
        return i.length > 40 ? i.substr(0, 40) : i;
      });

      i.categories = categories.join('|');

      products[i.productId] = i;
      items.splice(k, 1);

      items.forEach(function(ii, kk) {

        if(ii.productId == i.productId) {

          var categories = ii.categories.split('|');
          categories.splice(0, 2);
          categories = categories.map(function(i) {
            return i.length > 39 ? i.substr(0, 39).trim() : i;
          });

          ii.categories = categories.join('|');

          products[i.productId].categories += '@' + ii.categories;
          items.splice(kk, 1);
        }

      });

    });


    var counter = 0;

    products = _.toArray(products);

    async.eachSeries(products, function(product, callback) {

      data = [
        '"' + product.categories + '"',
        '"' + product.name.trim() + '"',
        '"' + product.brand.trim() + '"',
        '"' + product.productId.trim() + '"',
        '"' + product.description.replace(/(\r\n|\n|\r)/gm,"").replace(/\t/gm, ' ').trim() + '"',
        product.price * 6.5 || 0,
        '"' + product.image + '"',
        '"' + product._id + '"'
      ];

      fs.appendFileSync(__dirname + '/export.csv', data.join(';') + "\n");

      ++counter;

      callback();

    }, process.exit);
  };

  var cursor = mongo.collection('products').find({});
  var items = [];

  cursor.each(function(err, product) {

    if(err) {
      console.log(err);
      return;
    }

    if(product == null) {
      mongo.close();
      console.log(items.length);
      handle(items);
      return;
    }

    items.push(product);
  });

}


else {
  console.log('Nothing to do. Exit...');
  process.exit();
}
