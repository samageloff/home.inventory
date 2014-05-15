HeaderView = Backbone.View.extend({

  template: _.template($('#headerTemplate').html()),

  initialize: function() {
    this.render();
  },

  events: {
    'click #new-item': 'newItem'
  },

  newItem: function(e) {
    console.log('new item');
    itemRouter.navigate('item/new', true);
    return false;
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  }
});