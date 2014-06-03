App.SingleItemEditView = Backbone.View.extend({

  events: {
    'change input, textarea': 'changed',
    'click #cancel': 'cancel'
  },

  template: _.template($('#edit-item-template').html()),

  initialize: function() {
    _.bindAll(this, 'changed');
    console.log(this);
  },

  render: function() {
    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    return this;
    this.setElement(this.template(markup));
  },

  changed: function(e) {
    var changed = e.currentTarget,
        value = $(e.currentTarget).val(),
        slugVal = convertToSlug($('#category').val()),
        obj = {};
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
    var id = this.model.get('id');
    App.router.navigate('view/'+id, true);
  },

  onClose: function(){
    this.model.unbind('change', this.render);
  }

});