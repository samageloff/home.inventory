var HeaderView = Backbone.View.extend({
  events: {
    "click .new" : "newItem"
  },

  template: _.template($('#header-template').html()),

  initialize: function() {
    this.render();
  },

  render: function () {
    $(this.el).html(this.template());
    return this;
  },

  newItem:function () {
    router.navigate("/new", true);
  }

});