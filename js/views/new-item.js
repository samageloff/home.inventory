App.NewItemView = Backbone.View.extend({

  events: {
    'submit #new-item-form': 'save',
    'click #save': 'save',
    'click #cancel': 'close',
    'click .icon-close': 'removeImage'
  },

  template: App.TemplateCache.get('#new-item-template'),

  initialize: function() {
    _.bindAll(this, 'save');
    Backbone.Validation.bind(this);
    Backbone.pubSub.trigger('header-hide', this);
    Backbone.pubSub.trigger('header-default', this);

    // Listen for image upload and pass to current model
    Backbone.pubSub.on('image-upload-complete', function() {
      console.log('image-upload-complete, trigger');
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
    console.log('this.model.set -> setImagePath', App.imager.image_store);
    this.updatePlaceholder(App.imager.image_store[3]);
  },

  save: function(e) {
    e.preventDefault();
    var self = this;
    var data = $('#new-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data.slug = slugVal;

    this.model.set(data);
    console.log('this.model.set -> save', data);

    if(this.model.isValid(true)) {
      this.model.save(data, {
        success: function(response, model) {
          console.log('this.model.save -> success', data);
          self.close();
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
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
    placeholder.append('<img />').append('<a />').fadeIn('fast');

    // find image + add image src
    placeholder.find('img').attr('src', App.imager.image_store[0]);

    // find close button add icon + href
    placeholder
      .find('a')
      .addClass('icon-close')
      .attr('href', '#')
      .attr('data-id', path);
  },

  removeImage: function(e) {
    e.preventDefault();

    var $self = $(e.target).closest('.media-block'),
        image_id = $self.data('id');

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {
        $self.find('img, a').remove();
        $self.append('<div />').addClass('.progress-bar-indication');
        Backbone.pubSub.trigger('image-remove', this);
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      });
    }
  },

  close: function() {
    console.log('Kill:App.NewItemView ', this);
    this.unbind();
    this.remove();
    App.categoryService('dispose');
    App.router.navigate('#/');
  }

});