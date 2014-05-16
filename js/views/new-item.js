var NewItemView = Backbone.View.extend({
  className: 'view-wrap slim',

  template: _.template($('#new-item-template').html()),

  events: {
    'change input': 'changed',
    'click .done': 'done'
  },

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

  done: function(e) {
    e.preventDefault();
    this.onClose();
    var id = this.model.get('id');
    router.navigate('view/'+id, true);
  },

  onClose: function(){
    this.model.unbind('change', this.render);
  }

});