var HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: _.template($('#home-template').html()),

  initialize: function() {
    this.render();
  },

  render: function () {
    $(this.el).html(this.template());
    return this;
  }
});