App.SingleItemView = Backbone.View.extend({

  events: {
    'click .icon-edit': 'edit',
    'click .icon-trash': 'trash'
  },
  template: _.template($('#single-view-template').html()),

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    return this;

    this.setElement(this.template(markup));
  },

  edit: function() {
    App.router.navigate("/edit/" + this.model.id, true);
  },

  trash: function() {
    if (window.confirm('Are you sure?')) {
      this.model.destroy();
      this.remove();
      App.router.navigate("/", true);
    }
  }
});