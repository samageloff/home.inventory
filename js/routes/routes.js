App.Router = Backbone.Router.extend({

  routes: {
    '': 'home',
    'categories': 'categoryList',
    'category/:id': 'groupList',
    'group/:id': 'groupList',
    'edit/:id': 'edit',
    'view/:id': 'view',
    'new': 'new',
    '*notFound': 'notFound'
  },

  initialize: function () {
    var headerView = new App.HeaderView();
    $('#header').html(headerView.render().el);
  },

  home: function() {
    var model = new App.HomeModel();
    model.fetch({
      success: function() {
        var homeView = new App.HomeView({ model: model });
        $('#main').html(homeView.render().el);
      }
    });
  },

  categoryList: function(id) {
    var categoryIndexView = new App.CategoryIndexView();
    $('#main').html(categoryIndexView.render().el);
  },

  groupList: function(id) {
    var category = new App.ItemListModel({ id: id });
    var categoryListView = new App.ItemListView({ model: category });
    $('#main').html(categoryListView.render().el);
  },

  view: function(id) {
    var model = new App.SingleItemModel({ id: id });
    model.fetch({
      success: function() {
        var singleItemView = new App.SingleItemView({ model: model });
        $('#main').html(singleItemView.render().el);
      }
    });
  },

  new: function() {
    var model = new App.NewItemModel();
    model.fetch({
      success: function() {
        var newItemView = new App.NewItemView({ model: model });
        $('#main').html(newItemView.render().el);
        App.imager();
        App.categoryService();
        App.displayToggle();
      }
    });
  },

  edit: function(id) {
    var model = new App.SingleItemModel({ id: id });
    model.fetch({
      success: function() {
        var singleItemEditView = new App.SingleItemEditView({ model: model });
        $('#main').html(singleItemEditView.render().el);
        App.imager();
        App.displayToggle();
      }
    });
  },

  notFound: function() {
    $('#main').html('<h1>It\'s broken</h1>');
  }

});