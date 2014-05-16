var SingleItemEditView = Backbone.View.extend({
  template: _.template($('#edit-item-template').html()),

  events: {
    'click .save': 'save',
    'click .cancel': 'cancel'
  },

  render: function() {
    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  save: function(e) {
    console.log('save edit')
    e.preventDefault();
    this.model.save();
  },

  cancel: function(e) {
    console.log('cancel edit')
    e.preventDefault();
    this.model.save();
  }

});