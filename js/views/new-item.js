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
    Backbone.pubSub.trigger('header-hide', this);

    // Listen for image upload and pass to current model
    Backbone.pubSub.on('image-upload-complete', function() {
      this.setImagePath();
    }, this);
  },

  render: function() {
    var markup = this.model.toJSON();
    this.$el.html(this.template(markup)).fadeIn('fast');
    return this;
  },

  setImagePath: function() {
    this.model.set('image', App.imager.image_store);
  },

  save: function(e) {
    e.preventDefault();
    var data = $('#new-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data['slug'] = slugVal;

    this.model.set(data);

    if(this.model.isValid(true)) {
      this.model.save(data, {
        success: function(response, model) {
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
  },

  cancel: function(e) {
    e.preventDefault();
    this.close();
    App.router.navigate('#/');
  },

  close: function() {
    console.log('Kill: ', this);
    App.categoryService('dispose');
    this.unbind();
    this.remove();
  }

});