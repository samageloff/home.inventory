var Controller = Marionette.Controller.extend({

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

  new: function() {
    var model = new App.NewItemModel();
    var awsconfig = new App.AwsConfigModel();
    awsconfig.fetch({
      success: function() {
        var newItemView = new App.NewItemView({ model: model });
        var imageUploadView = new App.ImageUploadView({ model: awsconfig });
        $('#main').html(newItemView.render().el);
        App.Helpers.dropdot();
      }
    });
  },

  edit: function(id) {
    var model = new App.SingleItemModel({ id: id });
    var awsconfig = new App.AwsConfigModel();
    model.fetch({
      success: function() {
        var singleItemEditView = new App.SingleItemEditView({ model: model });
        $('#main').html(singleItemEditView.render().el);
      }
    });
    awsconfig.fetch({
      success: function() {
        var imageUploadView = new App.ImageUploadView({ model: awsconfig });
        $('#upload').html(imageUploadView.render().el);
        App.Helpers.dropdot();
      }
    });
  },

  view: function(id) {
    var model = new App.SingleItemModel({ id: id });
    console.log('model', model);
    model.fetch({
      success: function() {
        var singleItemView = new App.SingleItemView({ model: model });
        $('#main').html(singleItemView.render().el);
      }
    });
  },

  notFound: function() {
    $('#main').html('<h1>It\'s broken</h1>');
  }

})