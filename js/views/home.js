App.HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: _.template($('#home-template').html()),

  events: {
    'click #add-item': 'close',
    'click #browse-categories': 'close'
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

  close: function() {
    console.log('Kill: ', this);
    this.unbind();
    this.remove();
  }

});