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
      this.setImagePath();
    }, this);

    Backbone.pubSub.on('image-remove', function() {
      this.unsetImage();
    }, this);

  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(markup)).fadeIn('fast');

    return this;
  },

  setImagePath: function() {
    this.model.save('image', App.imager.image_store);
    this.updatePlaceholder(App.imager.image_store[3]);
  },

  updatePlaceholder: function(src) {
    var $placeholder = $('.upload-placeholder'),
        $uploadButton = $('.direct-upload'),
        path = src;

    // clear placeholder
    // TODO: this may eventually be an array
    // handle it, hacky
    $placeholder.empty();
    $('#upload-placeholder').empty();
    $uploadButton.hide();

    // add image + close button
    $placeholder.append('<img />').append('<a />').fadeIn('fast');

    // find image + add image src
    $placeholder.find('img').attr('src', App.imager.image_store[0]);

    // find close button add icon + href
    $placeholder
      .find('a')
      .addClass('icon-close')
      .attr('href', '#')
      .attr('data-id', path)
  },

  removeImage: function(e) {
    e.preventDefault();

    var $self = $(e.target),
        image_id = $self.data('id');

        console.log('image_id', image_id);

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {

        console.log('data', data);

        $self.closest('.media-block').find('img').remove();
        $self.remove();
        Backbone.pubSub.trigger('image-remove', this);
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      })
    }
    else {
      $self.closest('.media-block').fadeOut('250');
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
        },
        error: function(model, xhr, options) {
          alert(xhr.responseText);
          App.router.navigate('#/');
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
    console.log('Kill:App.SingleItemEditView ', this);
    App.categoryService('dispose');
    this.unbind();
    this.remove();
  }

});