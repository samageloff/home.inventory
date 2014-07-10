App.ItemListView = Backbone.View.extend({

  tagName: 'section',
  className: 'items grid-items-lines',

  initialize: function() {
    _.bindAll(this, 'render');

    this.collection = new App.ItemListCollection();
    this.collection.fetch({reset: true});
    this.render();

    this.listenTo(this.collection, 'reset', this.render);
    Backbone.pubSub.trigger('header-show', this);
    Backbone.pubSub.trigger('item-list', this);
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

  onClose: function(){
    this.model.unbind('change', this.render);
  }

});