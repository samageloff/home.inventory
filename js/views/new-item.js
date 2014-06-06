App.NewItemView = Backbone.View.extend({

  events: {
    'click #save': 'save',
    'click #cancel': 'cancel'
  },

  template: _.template($('#new-item-template').html()),

  initialize: function() {
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
    var data = $('#new-item-form').serializeObject();
    this.model.set(data);

    if(this.model.isValid(true)){
      this.model.save();
    }
  },

  remove: function() {
    // Remove the validation binding
    // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
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