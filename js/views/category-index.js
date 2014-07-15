App.CategoryIndexView = Backbone.View.extend({

  tagName: 'section',
  className: 'groups grid-items-lines',

  events: {
    'click .grid-item': 'close'
  },

  initialize: function() {
    this.collection = new App.CategoryIndexCollection();
    this.collection.fetch({reset: true});
    this.render();
    this.listenTo(this.collection, 'reset', this.render);
    Backbone.pubSub.trigger('header-default', this);
  },

  render: function() {
    this.$el.empty();

    // if there are no categories, redirect
    if (this.collection.length === 0) {
      App.router.navigate('#/');
    }

    // iterate over collection and create subview
    // for each category item
    this.collection.each(function(item) {
      this.renderCategory(item);
    }, this);
    return this;
  },

  renderCategory: function(item) {
    var categoryView = new App.CategoryIndexItemView({ model: item });
    this.$el.append(categoryView.render().el);
  },

  close: function() {
    console.log('Kill: ', this);
    this.unbind();
    this.remove();
  }

});