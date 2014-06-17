App.NewItemView = Backbone.View.extend({

  events: {
    'submit #new-item-form': 'save',
    'click #save': 'save',
    'click #cancel': 'cancel',
    'change #upload-file': 'upload'
  },

  template: _.template($('#new-item-template').html()),

  initialize: function(options) {
    _.bindAll(this, 'save');
    this.options = options || {};
    Backbone.Validation.bind(this);

    App.dropdot();
  },

  render: function() {
    var markup = this.model.toJSON(), // un-needed?
        configs = this.options.config.toJSON();

    this.$el.empty();
    this.setElement(this.template(configs));
    this.dropdot();

    return this;
  },

  save: function(e) {
    e.preventDefault();
    var data = $('#new-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data['slug'] = slugVal;

    console.log('data', data);
    this.model.set(data);

    if(this.model.isValid(true)){
      this.model.save(data, {
        success: function(response, model) {
          console.log('model', model, response);
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
  },

  dropdot: function() {
    App.dropdot();
  },

  remove: function() {
    Backbone.Validation.unbind(this);
    return Backbone.View.prototype.remove.apply(this, arguments);
  },

  cancel: function(e) {
    e.preventDefault();
    this.onClose();
    App.router.navigate('#/');
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