App.HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: _.template($('#home-template').html()),
  getStarted: _.template($('#get-started-template').html()),

  events: {
    'click .grid-item': 'close'
  },

  initialize: function() {
    Backbone.pubSub.trigger('header-show', this);
    Backbone.pubSub.trigger('header-home', this);
  },

  render: function() {
    this.$el.empty();
    var count = this.model.get('count');

    if (count) {
      var totalVal = this.model.get('value');
      this.model.set('value', App.convertLargeNum(totalVal));
      this.$el.html(this.template(this.model.toJSON()));
    }
    else {
      this.$el.html(this.getStarted());
    }
    return this;
  },

  close: function() {
    console.log('Kill: ', this);
    this.unbind();
    this.remove();
  }

});