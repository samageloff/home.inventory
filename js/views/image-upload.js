App.ImageUploadView = Backbone.View.extend({

  template: _.template($('#image-upload-template').html()),

  initialize: function(options) {
    Backbone.pubSub.on('image-upload-complete', function() {
      this.updatePlaceholder();
    }, this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.setElement(this.template(markup));

    return this;
  },

  updatePlaceholder: function() {
    var placeholder = $('.upload-placeholder');

    // clear placeholder
    // TODO: this may eventually be an array
    // handle it
    placeholder.empty();

    // add image + close button
    placeholder
      .append('<img />')
      .append('<a />')

    // find image + add image src
    placeholder
      .find('img')
      .attr('src', App.dropdot.image_store);

    // find close button add icon + href
    placeholder
      .find('a')
      .addClass('icon-close')
      .attr('href', '#')
  }

});