var NewItemView = Backbone.View.extend({
  className: 'view-wrap slim',

  template: _.template($('#new-item-template').html()),

  events: {
    'change input': 'changed',
    'click .close': 'close'
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
    var obj = {};
    obj[changed.id] = value;
    obj['slug'] = slugVal;
    this.model.save(obj, {
      success: function() {
        console.log(obj);
      }
    })
  },

  close: function(e) {
    e.preventDefault();
    this.onClose();
    router.navigate('', true);
  },

  onClose: function(){
    this.model.unbind('change', this.render);
  }

});