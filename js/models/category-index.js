var App = App || {};

App.CategoryIndexModel = Backbone.Model.extend({
  defaults: {
    _id: '',
    description: '',
    slug: '',
    value: 0,
    count: 0
  }
});