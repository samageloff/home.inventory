App.SingleItemView = Backbone.View.extend({

  events: {
    'click .icon-close': 'close',
    'click .icon-edit': 'edit',
    'click .icon-trash': 'trash'
  },
  template: _.template($('#single-view-template').html()),

  initialize: function() {
    Backbone.pubSub.trigger('header-hide', this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    return this;

    this.setElement(this.template(markup));
  },

  close: function(e) {
    e.preventDefault();
    App.router.navigate("#/category/" + this.model.get('slug'), true);
  },

  edit: function() {
    App.router.navigate("/edit/" + this.model.id, true);
  },

  trash: function() {
    if (window.confirm('Are you sure?')) {
      this.model.destroy();
      this.remove();
      App.router.navigate("/", true);
    }
  }
});