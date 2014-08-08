App.ItemListView = Backbone.View.extend({

  tagName: 'section',
  className: 'items grid-items-lines',

  events: {
    'click .grid-item': 'close'
  },

  initialize: function() {
    Backbone.pubSub.trigger('header-show', this);
    Backbone.pubSub.trigger('item-list', this);
    Backbone.pubSub.on('remove-category-list', function() {
      this.close();
    }, this);

    console.log('item list');

    this.listenTo(this.collection, 'reset', this.render);
  },

  render: function() {
    this.$el.empty();
    this.collection.each(function(item) {
      this.renderCategory(item);
    }, this);

    return this;
  },

  renderCategory: function(item) {
    var categoryListView = new App.ItemView({ model: item });
    this.$el.append(categoryListView.render().el);
  },

  close: function() {
    console.log('Kill:App.ItemListView ', this);
    this.unbind();
    this.remove();
  }

});