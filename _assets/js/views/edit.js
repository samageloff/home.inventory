EditView = Backbone.View.extend({

  tagName: 'div',
  id: 'edit-mode',
  template: _.template($('#editTemplate').html()),

  initialize: function() {
    console.log('!', this.model);
    $('body').html(this.el);
    this.render();
  },

  events: {
    'click .save-item': 'saveItem',
    'click .cancel-item': 'cancelItem'
  },

  saveItem: function(e) {
    e.preventDefault();
    console.log('save item');
  },

  cancelItem: function(e) {
    e.preventDefault();
    console.log('cancel item');
  },

  render: function() {
    var data = this.model.toJSON();
    this.$el.html(this.template(data));
    return this;
  }
});