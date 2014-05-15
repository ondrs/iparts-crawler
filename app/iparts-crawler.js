var Q = require('Q'),
  Krawler = require('krawler'),
  events = require('events'),
  util = require('util'),
  async = require('async');

var krawler = new Krawler();


/**
 * {MongoClient} mongo
 * @constructor
 */
function IPartsCrawler(mongo) {
  this.mongo_ = mongo;
  events.EventEmitter.call(this);
}

util.inherits(IPartsCrawler, events.EventEmitter);


/**
 * {MongoClient}
 * @private
 */
IPartsCrawler.prototype.mongo_;


/**
 *
 * @param {string} url
 * @returns {Q.promise}
 */
IPartsCrawler.prototype.findLinksInHomepage = function(url) {
  var self = this;

  return krawler
    .fetchUrl(url)
    .then(function(result) {

      self.emit('urlFetched', url);

      var $ = result.data,
        urls = [];

      $('.wyszukiwarka').eq(0).find('ul').find('a').each(function() {
        urls.push($(this).attr('href'));
      });


      return Q.resolve(urls);
    });
};


/**
 *
 * @param {string} url
 * @returns {Q.promise}
 */
IPartsCrawler.prototype.findLinksInParts = function(url) {
  var self = this;

  return krawler
    .fetchUrl(url)
    .then(function(result) {

      self.emit('urlFetched', url);

      var $ = result.data,
        urls = [];


      $('.kategorie-midd2').find('a').each(function() {
        urls.push('http://www.iparts.pl' + $(this).attr('href'));
      });


      return Q.resolve(urls);
    });
};


/**
 *
 * @param {string} url
 * @returns {Q.promise}
 */
IPartsCrawler.prototype.findLinksInCatalog = function(url) {
  var self = this;

  return krawler
    .fetchUrl(url)
    .then(function(result) {

      self.emit('urlFetched', url);

      var $ = result.data,
        urls = [];


      $('.katalog-zdjecie').find('a').each(function() {
        urls.push('http://www.iparts.pl' + $(this).attr('href'));
      });


      return Q.resolve(urls);
    });
};


/**
 *
 * @param {string} url
 * @returns {Q.promise}
 */
IPartsCrawler.prototype.findProducts = function(url) {
  var self = this;

  return krawler
    .fetchUrl(url)
    .then(function(result) {

      self.emit('urlFetched', url);

      var $ = result.data,
        products = [];


      $('.katalog-produkt').each(function() {

        var categories = [];

        $('.page_path').find('li').each(function() {
          categories.push($(this).text());
        });

        categories.pop(); //remove last

        products.push({
          url: 'http://www.iparts.pl' + $(this).find('.katalog-zdjecie').find('a').attr('href'),
          categories: categories.join('|'),
          name: $(this).find('h2').text().trim(),
          brand: $(this).find('h3 span').text().trim(),
          productId: $(this).find('h2').next('p').find('span').text().trim(),
          description: $(this).find('.katalog-opis-extra').text().trim(),
          price: parseFloat($(this).find('.katalog-cena b').text()),
          image: $(this).find('.katalog-zdjecie').find('img').attr('src')
        });
      });

      return Q.resolve(products);
    });
};


/**
 *
 * @param {string} url
 * @returns {Q.promise}
 */
IPartsCrawler.prototype.parseDetail = function(url) {
  var self = this;

  return krawler
    .fetchUrl(url)
    .then(function(result) {
      var deffered = Q.defer();

      self.emit('detailFetched', url);

      var $ = result.data,
        categories = [];

      $('.page_path').find('li').each(function() {
        categories.push($(this).text());
      });

      categories.pop(); //remove last


      try {
        var product = {
          url: url,
          categories: categories.join('|'),
          name: $('h1').text().trim(),
          brand: $('h3[itemprop=brand]').text().trim(),
          productId: $('span[itemprop=productID]').text().trim(),
          description: $('div[itemprop=description]').text().trim(),
          price: parseFloat($('b[itemprop=price]').text()),
          image: $('.skp-zdjecie').find('img').attr('src')
        };

        deffered.resolve(product);
      } catch (e) {
        deffered.reject(e);
      }

      return deffered.promise;
    }, function(err) {

    });
};


/**
 *
 * @param {Object} product
 * @returns {Q.promise}
 */
IPartsCrawler.prototype.saveProduct = function(product) {
  var self = this,
    deferred = Q.defer();

  self.mongo_.collection('products').insert(product, function(err, result) {
    if(err) {
      deferred.reject(err);
      console.log(err);
      return;
    }

    self.emit('productSaved', product.name);
    deferred.resolve(result);
  });

  return deferred.promise;
};


/**
 * @param {Array} urls
 * @returns {Q.promise}
 */
IPartsCrawler.prototype.fetchProducts = function(urls) {
  var self = this,
    deferred = Q.defer();

  async.eachLimit(urls, 6, function(url, callback) {

    console.log(url);

    self
      .parseDetail(url)
      .then(function(product) {
        return self.saveProduct(product);
      })
      .fin(callback);

  }, function(err) {
    if(err) deferred.reject(err);
    else    deferred.resolve();
  });

  return deferred.promise;
};


module.exports = IPartsCrawler;
