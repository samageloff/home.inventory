App.SingleItemEditView = Backbone.View.extend({

  events: {
    'click #save': 'save',
    'click #cancel': 'cancel'
  },

  template: _.template($('#edit-item-template').html()),

  initialize: function() {
    _.bindAll(this, 'save');
    Backbone.Validation.bind(this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    this.setElement(this.template(markup));

    return this;
  },

  save: function(e) {
    var data = $('#edit-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = convertToSlug($('#category').val());
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