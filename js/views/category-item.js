App.CategoryIndexItemView = Backbone.View.extend({
  template: _.template($('#category-summary-template').html()),

  render: function() {
    this.$el.empty();
    var title = this.model.get('_id'),
        totalVal = this.model.get('value'),
        markup = this.model.toJSON();

    // TODO: configure API response to include slug
    this.model.set('value', App.convertLargeNum(totalVal));

    this.$el.html(this.template(markup)).fadeIn('fast');
    return this;
  }

});