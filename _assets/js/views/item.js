ItemView = Backbone.View.extend({

  tagName: 'tr',
  template: _.template($('#itemTemplate').html()),

  events: {
    'click .delete-item': 'deleteItem'
  },

  deleteItem: function(e) {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {

      //Delete model
      this.model.destroy();

      //Delete view
      this.remove();
    }
  },

  render: function() {
    //this.el is what we defined in tagName. use $el to get access to jQuery html() function
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  }
});