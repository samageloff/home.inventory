var ItemListView = Backbone.View.extend({
  el: '#main',
  tagName: 'ul',
  className: 'list-group',

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