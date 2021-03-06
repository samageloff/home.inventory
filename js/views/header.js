App.HeaderView = Backbone.View.extend({

  template: App.TemplateCache.get('#header-template'),

  events: {
    'click .new' : 'newItem',
    'click .icon-back': 'goBack',
    'click .root': 'goToRoot'
  },

  initialize: function() {
    this.render();

    Backbone.pubSub.on('header-default', function() {
      this.setCurrentView('header-default', {
        'text': '',
        'currentClass': 'icon-home'
      });
    }, this);

    Backbone.pubSub.on('header-home', function() {
      this.setCurrentView('header-home', {
        'text': '',
        'currentClass': 'icon-home'
      });
    }, this);

    Backbone.pubSub.on('item-list', function() {
      this.setCurrentView('item-list', {
        'text': App.convertToProperTitle(Backbone.history.fragment.split('/')[1]),
        'currentClass': 'icon-back'
      });
    }, this);

    Backbone.pubSub.on('category-index', function() {
      this.setCurrentView('category-index', {
        'text': 'All Categories',
        'currentClass': 'icon-back root'
      });
    }, this);

    Backbone.pubSub.on('header-hide', function() {
      this.displayHeader({
        'display': 'hide'
      });
    }, this);

    Backbone.pubSub.on('header-show', function() {
      this.displayHeader({
        'display': 'show'
      });
    }, this);

  },

  render: function () {
    $(this.el).html(this.template());
    return this;
  },

  newItem: function () {
    this.close();
    App.router.navigate("/new", true);
  },

  setCurrentView: function(view, config) {
    var conf = config,
        location = $('.location'),
        navigation = $('.navigation');

      location.text(conf.text);
      navigation.find('a')
        .removeClass()
        .addClass(conf.currentClass);
  },

  goBack: function(e, conf) {
    e.preventDefault();
    App.router.navigate('#/categories');
  },

  goToRoot: function(e) {
    e.preventDefault();
    App.router.navigate('#/');
  },

  displayHeader: function(config) {
    var conf = config;
    $('#header')
      .removeClass()
      .addClass(conf.display);
  }

});