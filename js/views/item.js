var App = App || {};

App.ItemView = Backbone.View.extend({
  events: {
    'click .edit': 'edit',
    'click .delete': 'delete'
  },
  template: App.TemplateCache.get('#category-items-template'),

  render: function() {
    var markup = this.model.toJSON();
    this.$el.empty();
    this.$el.html(this.template(markup)).fadeIn('fast');
    console.log('item.js');
    return this;
  },

  edit: function(e) {
    e.preventDefault();
    this.close();
    App.router.navigate('#/edit/' + this.model.id);
  },

  delete: function(e) {
    var collection_length = this.model.collection.length,
        category = this.model.get('slug');

    e.preventDefault();

      var $self = $(e.target),
          image_id = $self.data('id');

      if (image_id) {
        $.get('api/remove/' + image_id, function(data) {
          Backbone.pubSub.trigger('image-remove', this);
        })
        .fail(function() {
          console.log('Failed to remove the image.');
        });
      }

      this.model.destroy({
        success: function(response, model) {
          if (collection_length > 1) {
            App.router.navigate('#/category/' + category);
          }
          else {
            App.router.navigate('#/categories');
          }
          this.close();
        },
        error: function() {
          console.log('An error has occurred');
        }
      });

    // e.stopImmediatePropagation();

  },

  close: function() {
    console.log('Kill:App.ItemView ', this);
    this.unbind();
    this.remove();
  }

});