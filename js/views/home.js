App.HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: _.template($('#home-template').html()),
  getStarted: _.template($('#get-started-template').html()),

  render: function() {
    this.$el.empty();
    var count = this.model.get('count');

    if (count) {
      // TODO: make this accessible
      var totalVal = this.model.get('value');
      this.model.set('value', App.convertLargeNum(totalVal));

      this.$el.html(this.template(this.model.toJSON()));
    }
    else {
      this.$el.html(this.getStarted());
    }

    return this;
  }

});