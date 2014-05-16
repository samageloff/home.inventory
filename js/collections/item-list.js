var ItemListCollection = Backbone.Collection.extend({

  initialize : function (options) {
    this.options = options || {};
    this.fragment = Backbone.history.fragment;
  },

  model: ItemListModel,

  url: function() {
    return 'api/' + this.fragment;
  }

});