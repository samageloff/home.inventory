var api = require('../controllers/api'),
    uploads = require('../controllers/uploads'),
    crypto = require('crypto'),
    mime = require('mime'),
    uuid = require('node-uuid'),
    moment = require('moment'),
    config = require('../app/config');

module.exports.initialize = function(app) {

  app.get('/api/home', api.home);
  app.get('/api/items', api.all);
  app.get('/api/items/:id', api.single);
  app.get('/api/categories', api.categories);
  app.get('/api/category/:name', api.category);

  app.get('/uploads/config', uploads.config);
  app.get('/uploads/signed', uploads.signed);

  app.post('/api/items', api.insert);

  app.put('/api/items/:id', api.update);

  app.delete('/api/items/:id', api.delete);
  app.delete('/api/category/:name/:id', api.delete);

};