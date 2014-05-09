InventoryRouter = Backbone.Router.extend({

  routes: {
    '' : 'index',
    'edit/:id' : 'edit'
  },

  index: function() {
    var collection = new Inventory();
    collection.fetch({reset: true});
    this.loadView(new InventoryView({ collection: collection }));
    console.log('index view loaded');
  },

  edit: function(id) {
    var model = new Item({ id: id });
    model.fetch();
    this.loadView(new EditView({ model: model }));
    console.log('edit view loaded', id);
  },

  loadView: function(view) {
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = view;
    console.log('load view', this.view);
  }

});

var itemRouter = new InventoryRouter();

Backbone.history.start();