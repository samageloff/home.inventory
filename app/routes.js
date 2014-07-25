var api = require('../controllers/api'),
    passport = require('passport');


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports.initialize = function(app) {

  app.get('/api/home', api.home);
  app.get('/api/items', api.all);
  app.get('/api/items/:id', api.single);
  app.get('/api/categories', api.categories);
  app.get('/api/category/:name', api.category);
  app.get('/api/autocomplete', api.autocomplete);

  app.post('/api/items', api.insert);

  // images
  app.post('/api/upload', api.upload);
  app.get('/api/remove/:id', api.remove);

  // authentication
  app.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
  }));

  app.get('/', function(req, res){
    res.render('index', { user: req.user });
  });

  app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
  });

  app.get('/login', function(req, res){
    res.render('login', { user: req.user, message: req.session.messages });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.put('/api/items/:id', api.update);

  app.delete('/api/items/:id', api.delete);
  app.delete('/api/category/:name/:id', api.delete);

};