App.HeaderView = Backbone.View.extend({
  template: _.template($('#header-template').html()),

  events: {
    'click .new' : 'newItem',
    'click .icon-back': 'goBack'
  },

  initialize: function() {
    this.render();

    Backbone.pubSub.on('header-default', function() {
      this.setCurrentView('header-default', {
        'text': '',
        'currentClass': 'icon-home',
        'lastClass': 'icon-back'
      });
    }, this);

    Backbone.pubSub.on('item-list', function() {
      this.setCurrentView('item-list', {
        'text': Backbone.history.fragment.split('/')[1],
        'currentClass': 'icon-back',
        'lastClass': 'icon-home'
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
    var config = config,
        location = $('.location'),
        navigation = $('.navigation');

      location.text(config.text);
      navigation.find('a')
        .addClass(config.currentClass)
        .removeClass(config.lastClass);
  },

  goBack: function(e) {
    e.preventDefault();
    Backbone.pubSub.trigger('remove-category-list', this);
    App.router.navigate('#/categories');
  },

  displayHeader: function(config) {
    var config = config;
    $('#header')
      .removeClass()
      .addClass(config.display);
  }

});