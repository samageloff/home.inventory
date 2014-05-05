var app = app || {};

app.InventoryRouter = Backbone.Router.extend({

  routes: {
    'item/edit/:id' : 'editItem'
  },

  editItem: function(id) {
    this.item = new app.EditView({model:id});
    this.item.$el.html(this.item.template);
  }

});

var itemRouter = new app.InventoryRouter();

Backbone.history.start();