var App;

App = new Backbone.Marionette.Application();

App.addRegions({
  header: '#header',
  main: '#main',
  upload: '#upload'
});

App.on('start', function(options) {
  if (Backbone.history) {
    Backbone.history.start();
  }
  new Router();
});

App.start();