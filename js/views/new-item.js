App.NewItemView = Backbone.View.extend({

  events: {
    'submit #new-item-form': 'save',
    'click #save': 'save',
    'click #cancel': 'cancel'
  },

  template: _.template($('#new-item-template').html()),

  initialize: function() {
    _.bindAll(this, 'save');
    Backbone.Validation.bind(this);

    // Fetch AWS Config model
    this.uploader();

    // Listen for image upload and pass to current model
    Backbone.pubSub.on('image-upload-complete', function() {
      this.setImagePath();
    }, this);

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
      // Create new ImageUploadView
      // Prepend it to NewItemView
      // Initialize Dropdot method
      success: function() {
        var imageUploadView = new App.ImageUploadView({ model: config });
        $('#main').prepend(imageUploadView.render().el);
        App.dropdot();
      }
    });
  },

  setImagePath: function() {
    this.model.set('image', App.dropdot.image_store);
  },

  save: function(e) {
    e.preventDefault();
    var data = $('#new-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data['slug'] = slugVal;

    this.model.set(data);

    if(this.model.isValid(true)){
      this.model.save(data, {
        success: function(response, model) {
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
  },

  cancel: function(e) {
    e.preventDefault();
    this.onClose();
    App.router.navigate('#/');
  },

  onClose: function() {
    this.model.unbind('change', this.render);
  }

});