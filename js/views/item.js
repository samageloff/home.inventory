var ItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: _.template($('#category-items-template').html()),

  events: {
    'click a.delete': 'delete',
    'click a.edit': 'edit'
  },

  render: function() {
    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  delete: function(e) {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      this.model.destroy();
      this.remove();
    }
  }
});