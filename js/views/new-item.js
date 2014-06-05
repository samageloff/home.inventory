App.NewItemView = Backbone.View.extend({

  events: {
    'change input, textarea': 'changed',
    'click #cancel': 'cancel'
  },

  template: _.template($('#new-item-template').html()),

  initialize: function() {
    _.bindAll(this, 'changed');
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    this.setElement(this.template(markup));

    return this;
  },

  changed: function(e) {
    var options = {
      success: function() {
        console.log('Thanks for the submission');
      },
      error: function(model, error) {
        console.log(error, 'okay');
      }
    };

    var changed = e.currentTarget;
    var value = $(e.currentTarget).val();
    var slugVal = convertToSlug($('#category').val());

    var obj = {};
    obj[changed.id] = value;
    obj['slug'] = slugVal;

    this.model.save(obj, options);
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