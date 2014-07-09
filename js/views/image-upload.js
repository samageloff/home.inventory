App.ImageUploadView = Backbone.View.extend({

  template: _.template($('#image-upload-template').html()),

  initialize: function(options) {
    Backbone.pubSub.on('image-upload-complete', function() {
      this.updatePlaceholder();
    }, this);
  },

  render: function() {
    this.setElement(this.template());
    return this;
  },

  updatePlaceholder: function() {
    var placeholder = $('.upload-placeholder');

    // clear placeholder
    // TODO: this may eventually be an array
    // handle it
    placeholder.empty();
    $('#upload-placeholder').empty();

    // add image + close button
    placeholder
      .append('<img />')
      .append('<a />')

    // find image + add image src
    placeholder
      .find('img')
      // apply thumb
      .attr('src', App.imager.image_store[0]);

    // find close button add icon + href
    placeholder
      .find('a')
      .addClass('icon-close')
      .attr('href', '#')
  }

});