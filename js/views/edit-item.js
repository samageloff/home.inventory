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

    Backbone.pubSub.on('image-upload-complete', function() {
      this.getImage();
    }, this);

    this.uploader();

    console.log(this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.setElement(this.template(markup));

    return this;
  },

  uploader: function() {
    var config = new App.AwsConfigModel();
    config.fetch({
      success: function() {
        var imageUploadView = new App.ImageUploadView({ model: config });
        $('#main').prepend(imageUploadView.render().el);
        App.dropdot();
      }
    });
  },

  getImage: function() {
    this.model.save('image', App.dropdot.image_store);
  },

  removeImage: function(e) {
    e.preventDefault();
    this.model.unset('image');
    this.model.save();

    // TODO: render models independently?
    // kludgy because views are nested
    $('.icon-close')
      .closest('.media-block').remove();
  },

  save: function(e) {
    e.preventDefault();
    var data = $('#edit-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data['slug'] = slugVal;

    this.model.set(data);
    console.log('data', data);

    if(this.model.isValid(true)){
      this.model.save(data, {
        success: function(response, model) {
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
  },

  remove: function() {
    Backbone.Validation.unbind(this);
    return Backbone.View.prototype.remove.apply(this, arguments);
  },

  cancel: function(e) {
    e.preventDefault();
    this.onClose();
    App.router.navigate('#/view/' + this.model.id);
  },

  saved: function() {
    var btn = $('#save');
        btn
          .attr('disabled', 'disabled')
          .text('Saved');
  },

  onClose: function() {
    this.model.unbind('change', this.render);
  }

});