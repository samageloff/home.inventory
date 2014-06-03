App.HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: _.template($('#home-template').html()),

  render: function() {
    this.$el.empty();

    // TODO: make this accessible
    var totalVal = this.model.get('value');
    this.model.set('value', App.convertLargeNum(totalVal));

    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});