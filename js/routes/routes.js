/* Router */

var Router = Backbone.Router.extend({

  routes: {
    '': 'home',
    'category/:id': 'categoryList',
    'edit/:id': 'edit',
    'view/:id': 'view',
    'new': 'new',
    '*notFound': 'notFound'
  },

  home: function() {
    var categoryIndexView = new CategoryIndexView();
  },

  categoryList: function(id) {
    var category = new ItemListModel({ id: id });
    var categoryListView = new ItemListView({ model: category });
    $('#main').html(categoryListView.render().el);
  },

  edit: function(id) {
    var model = new SingleItemModel({ id: id });
    model.fetch({
      success: function() {
        var singleItemEditView = new SingleItemEditView({ model: model });
        $('#main').html(singleItemEditView.render().el);
      }
    });
  },

  view: function(id) {
    var model = new SingleItemModel({ id: id });
    model.fetch({
      success: function() {
        var singleItemView = new SingleItemView({ model: model });
        $('#main').html(singleItemView.render().el);
      }
    });
  },

  new: function() {
    var model = new NewItemModel({});
    var newItemView = new NewItemView({ model: model });
    $('#main').html(newItemView.render().el);
  },

  notFound: function() {
    $('#main').html('<h1>It\'s broken</h1>');
  },

  initialize:function () {
    $('#header').html(new HeaderView().render().el);
  }

});