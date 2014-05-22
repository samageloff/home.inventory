var api = require('../controllers/api');

module.exports.initialize = function(app) {
  app.get('/api', api.index);
  app.get('/api/items', api.items);
  app.get('/api/items/:id', api.itemsById);
  app.post('/api/items', api.insert);
  app.put('/api/items/:id', api.update);
  app.delete('/api/items/:id', api.delete);
  app.get('/api/category/:name', api.catByName);
  app.get('/api/categories', api.categories);
};