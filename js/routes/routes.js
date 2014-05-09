var app = app || {};

app.InventoryRouter = Backbone.Router.extend({

  routes: {
    "edit/:id" : "editItem"
    /* http://localhost:3000/#item/52ea770e0071e4652d000004 */
  },

  editItem: function(id) {
    console.log('id', id);
  }

});

var itemRouter = new app.InventoryRouter();

Backbone.history.start();