/* Single Item */
var SingleItemModel = Backbone.Model.extend({

  url: function() {
    return 'api/items/' + this.id;
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