var App = App || {};

App.CategoryIndexModel = Backbone.Model.extend({
  defaults: {
    _id: '',
    groups: 0,
    description: '',
    slug: '',
    image: '',
    value: 0,
    count: 0
  }
});