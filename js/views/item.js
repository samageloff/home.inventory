var App = App || {};

App.ItemView = Backbone.View.extend({
  events: {
    'click .edit': 'edit'
  },
  template: _.template($('#category-items-template').html()),

  render: function() {
    this.$el.empty();

    this.$el.html(this.template(this.model.toJSON()));
    var markup = this.model.toJSON();

    // Handles CSS workaround Bourbon Bitters
    this.$el
      .append('<div class="right-cover">')
      .append('<div class="bottom-cover">');
    return this;

    this.setElement(this.template(markup));
  },

  edit: function(e) {
    e.preventDefault();
    App.router.navigate('#/edit/' + this.model.id);
  },

  delete: function(e) {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      this.model.destroy();
      this.remove();
    }
  }
});