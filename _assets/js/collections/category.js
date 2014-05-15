Inventory = Backbone.Collection.extend({

  model: Item,
  url: '/api/category/:name',

  initialize: function() {

    this.on('reset', function() {
      this.updateDash();
    });

   },

  updateDash: function() {

    var totalCount = $('#total-count');
    var valueWrap = $('#value-wrap b');

    if (this.length) {
      var sum = this.map(function(model) {
        return +model.get('value');
      }).reduce(function(sum, addend) {
        return sum + addend;
      });

      if ($('.empty')) {
        $(this).remove();
      }
    }

    if (!this.length) {
      $('.list').append('<p class=\'empty\'>Let\'s add some stuff.</p>');
    }

    totalCount.html(this.length);
    valueWrap.html(sum);
   }

});