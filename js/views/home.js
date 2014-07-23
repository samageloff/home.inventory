App.HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: App.TemplateCache.get('#home-template'),

  events: {
    'click #add-item': 'addItem',
    'click #browse-categories': 'browseCategories'
  },

  initialize: function() {
    Backbone.pubSub.trigger('header-show', this);
    Backbone.pubSub.trigger('header-home', this);
  },

  render: function() {
    this.$el.empty();
    this.setHomeView();
    return this;
  },

  setHomeView: function() {
    var markup = this.model.toJSON(),
        count = this.model.get('count');

    if (count) {
      var totalVal = this.model.get('value');
      this.model.set('value', App.convertLargeNum(totalVal));
    }

    this.$el.html(this.template(markup)).fadeIn('fast');
  },

  addItem: function() {
    this.close();
    App.router.navigate('/new', {trigger: true});
  },

  browseCategories: function() {
    this.close();
    App.router.navigate('/categories', {trigger: true});
  },

  close: function() {
    console.log('Kill:App.HomeView ', this);
    this.unbind();
    this.remove();
  }

});