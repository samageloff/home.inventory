App.HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: _.template($('#home-template').html()),

  events: {
    'click #add-item': "addItem",
    'click #browse-categories': "browseCategories"
  },

  initialize: function() {
    this.render();
  },

  render: function () {
    $(this.el).html(this.template());
    return this;
  },

  addItem: function(e) {
    e.preventDefault();
    App.router.navigate("#/add");
  },

  browseCategories: function(e) {
    e.preventDefault();
    App.router.navigate("#/categories");
  }

});