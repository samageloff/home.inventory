App.ImageUploadView = Backbone.View.extend({

  events: {
    'click .icon-close': 'removeImage'
  },

  template: _.template($('#image-upload-template').html()),

  initialize: function(options) {
    Backbone.pubSub.on('image-upload-complete', function() {
      this.updatePlaceholder(App.imager.image_store[3]);
    }, this);
  },

  render: function() {
    this.setElement(this.template());
    return this;
  },

  updatePlaceholder: function(src) {
    var placeholder = $('.upload-placeholder'),
        path = src;

    // clear placeholder
    // TODO: this may eventually be an array
    // handle it, hacky
    placeholder.empty();
    $('#upload-placeholder').empty();

    // add image + close button
    placeholder.append('<img />').append('<a />')

    // find image + add image src
    placeholder.find('img').attr('src', App.imager.image_store[0]);

    // find close button add icon + href
    placeholder
      .find('a')
      .addClass('icon-close')
      .attr('href', '#')
      .attr('data-id', path)
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

  }

});