App.SingleItemEditView = Backbone.View.extend({

  events: {
    'submit': 'save',
    'click #cancel': 'cancel'
  },

  template: _.template($('#edit-item-template').html()),

  initialize: function(options) {
    _.bindAll(this, 'save');
    this.options = options || {};
    Backbone.Validation.bind(this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.setElement(this.template(markup));

    return this;
  },

  save: function(e) {
    e.preventDefault();
    var data = $('#edit-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    var imageUrl = $('.share-url').val();
    data['slug'] = slugVal;
    data['image'] = imageUrl;

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