var HeaderView = Backbone.View.extend({
  template: _.template($('#header-template').html()),

  initialize: function() {
    this.render();
  },

  render: function () {
    $(this.el).html(this.template());
    return this;
  },

  events: {
    "click .new" : "newItem"
  },

  newItem:function (event) {
    navigate("items/new", true);
    return false;
  }

});