var SingleItemView = Backbone.View.extend({
  className: 'view-wrap slim',
  events: {
    'click a.delete': 'delete'
  },
  template: _.template($('#single-view-template').html()),

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
      router.navigate("/", true);
    }
  }
});