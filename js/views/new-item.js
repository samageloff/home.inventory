App.NewItemView = Backbone.View.extend({
  className: 'view-wrap slim',

  events: {
    'change input': 'changed',
    'click #cancel': 'cancel'
  },

  template: _.template($('#new-item-template').html()),

  initialize: function() {
    _.bindAll(this, 'changed');
    console.log(this.model.attributes);
  },

  render: function() {
    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  changed: function(e) {
    var changed = e.currentTarget;
    var value = $(e.currentTarget).val();
    var slugVal = convertToSlug($('#category').val());

    // TODO: display/hide button if valid
    if (value !== null) {
      $('.done').removeClass('hide');
    }

    var obj = {};
    obj[changed.id] = value;
    obj['slug'] = slugVal;
    this.model.save(obj, {
      success: function() {
        console.log(obj);
      }
    })
  },

  cancel: function(e) {
    e.preventDefault();
    App.router.navigate('#/');
  },

  saved: function() {
    var btn = $('#save');
        btn
          .attr('disabled', 'disabled')
          .text('Saved');
  },

  viewer: function(e) {
    e.preventDefault();
    this.onClose();
    var id = this.model.get('id');
    router.navigate('view/'+id, true);
  },

  onClose: function(){
    this.model.unbind('change', this.render);
  }

});