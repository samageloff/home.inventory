var App = App || {};

App.ItemView = Backbone.View.extend({
  events: {
    'click .edit': 'edit',
    'click .delete': 'delete'
  },
  template: _.template($('#category-items-template').html()),

  render: function() {
    var markup = this.model.toJSON();
    this.$el.empty();
    this.setElement(this.template(markup));
    return this;
  },

  edit: function(e) {
    e.preventDefault();
    App.router.navigate('#/edit/' + this.model.id);
  },

  delete: function(e) {
    var collection_length = this.model.collection.length,
        category = this.model.get('slug');

    e.preventDefault();

    if (window.confirm('Are you sure?')) {

      var $self = $(e.target),
          image_id = $self.data('id');

      if (image_id) {
        $.get('api/remove/' + image_id, function(data) {
          Backbone.pubSub.trigger('image-remove', this);
        })
        .fail(function() {
          console.log('Failed to remove the image.');
        })
      }

      this.model.destroy();
      this.remove();

      if (collection_length > 1) {
        App.router.navigate('#/category/' + category);
      }
      else {
        App.router.navigate('#/categories');
      }

    }
  }
});