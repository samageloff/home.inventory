App.SingleItemEditView = Backbone.View.extend({

  events: {
    'submit #edit-item-form': 'save',
    'click #save': 'save',
    'click #cancel': 'cancel',
    'click .icon-close': 'removeImage'
  },

  template: _.template($('#edit-item-template').html()),

  initialize: function() {
    _.bindAll(this, 'save');
    Backbone.Validation.bind(this);

    Backbone.pubSub.trigger('header-hide', this);

    Backbone.pubSub.on('image-upload-complete', function() {
      this.getImage();
    }, this);

    Backbone.pubSub.on('image-remove', function() {
      this.unsetImage();
    }, this);

  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.setElement(this.template(markup));

    return this;
  },

  getImage: function() {
    this.model.save('image', App.imager.image_store);
  },

  removeImage: function(e) {
    e.preventDefault();

    var $self = $(e.target),
        image_id = $self.data('id');

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {
        $self.closest('.media-block').fadeOut('250');
        Backbone.pubSub.trigger('image-remove', this);
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      })
    }
    else {
      $self.closest('.media-block').fadeOut('250');
      Backbone.pubSub.trigger('image-remove', this);
    }

  },

  unsetImage: function() {
    console.log('unset image');
    this.model.unset('image');
    this.model.save();
  },

  save: function(e) {
    e.preventDefault();
    var self = this;
    var data = $('#edit-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data['slug'] = slugVal;

    this.model.set(data);
    console.log('data', data);

    if(this.model.isValid(true)){
      this.model.save(data, {
        success: function(response, model) {
          self.close();
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
  },

  cancel: function(e) {
    e.preventDefault();
    this.close();
    App.router.navigate('#/view/' + this.model.id);
  },

  close: function() {
    console.log('Kill: ', this);
    this.unbind();
    this.remove();
  }

});