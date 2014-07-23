App.HomeModel = Backbone.Model.extend({

  defaults: {
    _id: '',
    groups: 0,
    value: 0,
    count: 0
  },

  url: function() {
    return 'api/home/';
  },

  parse: function(response) {
    return response[0];
  }
});