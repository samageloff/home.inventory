App.CategoryIndexView = Backbone.View.extend({

  tagName: 'section',
  className: 'groups grid-items-lines',

  events: {
    'click .grid-item': 'close'
  },

  initialize: function() {
    Backbone.pubSub.trigger('category-index', this);
    this.listenTo(this.collection, 'reset', this.render);
  },

  render: function() {
    this.$el.empty();

    console.log(this.collection.length);

    // if there are no categories, redirect
    if (this.collection.length === 0) {
      App.router.navigate('#/');
    }

    // iterate over collection and create subview
    // for each category item
    else {
      this.collection.each(function(item) {
        this.renderCategory(item);
      }, this);
    }
    return this;
  },

  renderCategory: function(item) {
    var categoryView = new App.CategoryIndexItemView({ model: item });
    this.$el.append(categoryView.render().el);
  },

  close: function() {
    console.log('Kill:App.CategoryIndexView ', this);
    this.unbind();
    this.remove();
  }

});