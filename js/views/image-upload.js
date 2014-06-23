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
    placeholder.empty();
    placeholder.append('<img />')
    placeholder
      .find('img')
      .attr('src', App.dropdot.image_store);
  }

});