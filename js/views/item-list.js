var ItemListView = Backbone.View.extend({

  tagName: 'section',
  className: 'items grid-items-lines',

  initialize: function() {
    _.bindAll(this, 'render');

    this.collection = new ItemListCollection();
    this.collection.fetch({reset: true});
    this.render();

    this.listenTo(this.collection, 'reset', this.render)
  },

  render: function() {
    this.$el.empty();
    this.collection.each(function(item) {
      this.renderCategory(item);
    }, this);

    // Handles CSS workaround Bourbon Bitters
    this.$el
      .append('<div class="right-cover">')
      .append('<div class="bottom-cover">');
    return this;
  },

  renderCategory: function(item) {
    var categoryListView = new ItemView({ model: item });
    this.$el.append(categoryListView.render().el);
  },

  onClose: function(){
    this.model.unbind('change', this.render);
  }
});