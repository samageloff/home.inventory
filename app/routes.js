var api = require('../controllers/api'),
    images = require('../controllers/uploads');

module.exports.initialize = function(app) {

  app.get('/api/home', api.home);
  app.get('/api/items', api.all);
  app.get('/api/items/:id', api.single);
  app.get('/api/categories', api.categories);
  app.get('/api/category/:name', api.category);

  app.post('/api/items', api.insert);
  app.post('/upload', images.upload);

  app.put('/api/items/:id', api.update);

  app.delete('/api/items/:id', api.delete);
  app.delete('/api/category/:name/:id', api.delete);
};
