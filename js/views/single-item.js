var SingleItemView = Backbone.View.extend({
  template: _.template($('#single-view-template').html()),

  events: {
    'click a.delete': 'delete'
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
      this.navigate("/", true);
    }
  }
});