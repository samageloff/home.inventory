var App = App || {};

App.SingleItemModel = Backbone.Model.extend({

  events: {
    'click .icon-edit': 'edit'
  },

  url: function() {
    return 'api/items/' + this.id;
  },

  defaults: {
    title: '',
    category: '',
    description: '',
    slug: '',
    image: '',
    quantity: 0,
    value: 0
  },

  validate: function(attributes) {
    if (attributes.title === '') {
      return 'Item requires a title'
    }
  },

  initialize: function() {
    this.on('change', function() {
      console.log('- Values for this model have changed.');
    });
    this.on('invalid', function(model, error) {
      console.log(error);
    });
  },

  edit: function(e) {
    e.preventDefault();
    this.onClose();
    var id = this.model.get('id');
    router.navigate('edit/'+id, true);
  },

  onClose: function() {
    this.model.unbind('change', this.render);
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});