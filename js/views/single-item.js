App.SingleItemView = Backbone.View.extend({

  events: {
    'click .icon-close': 'collapse',
    'click .icon-edit': 'edit',
    'click .icon-trash': 'trash'
  },

  template: App.TemplateCache.get('#single-view-template'),

  initialize: function() {
    Backbone.pubSub.trigger('header-hide', this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(markup)).fadeIn('slow');
    return this;
  },

  collapse: function(e) {
    e.preventDefault();
    this.close();
    App.router.navigate("#/category/" + this.model.get('slug'), true);
  },

  edit: function() {
    this.close();
    App.router.navigate("/edit/" + this.model.id, true);
  },

  trash: function(e) {
    if (window.confirm('Are you sure?')) {
      this.removeImage(e);
      this.model.destroy();
      this.close();
      App.router.navigate("/", true);
    }
  },

  removeImage: function(e) {
    var $self = $(e.target),
        image_id = $self.data('id');

        console.log('image_id', image_id);

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      });
    }

  },

  close: function() {
    console.log('Kill:App.SingleItemView ', this);
    this.unbind();
    this.remove();
  }

});