var CategoryIndexView = Backbone.View.extend({
  el: '.grid-items-lines',
  tagName: 'div',

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

    // Handles CSS workaround Bourbon Bitters
    this.$el.append('<div class="right-cover">');
    this.$el.append('<div class="bottom-cover">');
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