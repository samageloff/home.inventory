var ItemListCollection = Backbone.Collection.extend({
  initialize : function (options) {
    this.options = options || {};
  },
  url: 'api/category/furniture',
  model: ItemListModel
});