var CategoryIndexView = Backbone.View.extend({
  el: '#main',
  tagName: 'ul',
  className: 'list-group',

  initialize: function() {
    this.collection = new CategoryIndexCollection();
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
    var categoryView = new CategoryIndexItemView({ model: item });
    this.$el.append(categoryView.render().el);
  },

  onClose: function(){
    this.model.unbind('change', this.render);
  }
});