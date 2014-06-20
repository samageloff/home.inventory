App.HomeView = Backbone.Marionette.ItemView.extend({

  tagName: 'section',
  className: 'landing',
  template: _.template($('#home-template').html()),

  render: function() {
    var totalVal = this.model.get('value');
    this.model.set('value', App.Helpers.convertLargeNum(totalVal));

    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});