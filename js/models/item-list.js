/* Item List */
var ItemListModel = Backbone.Model.extend({

  url: function() {
    return 'api/category/' + this.id;
  },

  defaults: {
    title: '',
    category: '',
    slug: '',
    image: '',
    value: 0
  },

  initialize: function() {
    // console.log('ItemListModel > initialize', this);
    // console.log('attributes', this.attributes)
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});