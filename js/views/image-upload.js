App.ImageUploadView = Backbone.View.extend({

  template: _.template($('#image-upload-template').html()),

  initialize: function(options) {
    this.options = options || {};
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.setElement(this.template(markup));

    return this;
  },

});