App.CategoryIndexView = Backbone.View.extend({

  tagName: 'section',
  className: 'groups grid-items-lines',

  initialize: function() {
    this.collection = new App.CategoryIndexCollection();
    this.collection.fetch({reset: true});
    this.render();
    this.listenTo(this.collection, 'reset', this.render);
    Backbone.pubSub.trigger('header-default', this);
  },

  render: function() {
    this.$el.empty();
    this.collection.each(function(item) {
      this.renderCategory(item);
    }, this);
    return this;
  },

  renderCategory: function(item) {
    var categoryView = new App.CategoryIndexItemView({ model: item });
    this.$el.append(categoryView.render().el);
  },

  onClose: function() {
    console.log('on close fired');
    this.model.unbind('change', this.render);
  }

});