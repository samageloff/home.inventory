var App = App || {};

App.ItemView = Backbone.View.extend({
  className: 'grid-item',
  events: {
    'click a.delete': 'delete',
    'click a.edit': 'edit'
  },
  template: _.template($('#category-items-template').html()),

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