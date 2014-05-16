var CategoryIndexItemView = Backbone.View.extend({

  tagName: 'li',
  className: 'list-group-item',
  template: _.template($('#category-summary-template').html()),

  render: function() {
    this.$el.empty();
    var title = this.model.get('_id');

    console.log(convertToSlug(title));
    // TODO: configure API response to include slug
    this.model.set({
      slug: convertToSlug(title)
    });

    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});