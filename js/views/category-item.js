var CategoryIndexItemView = Backbone.View.extend({
  className: 'list-group-item',
  tagName: 'li',
  template: _.template($('#category-summary-template').html()),

  render: function() {
    this.$el.empty();
    var title = this.model.get('_id');

    // TODO: configure API response to include slug
    this.model.set({
      slug: convertToSlug(title)
    });

    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});