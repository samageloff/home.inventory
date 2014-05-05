var app = app || {};

app.Inventory = Backbone.Collection.extend({

  model: app.Item,
  url: '/api/items',

  initialize: function() {

    this.on('add', function() {
      this.updateDash();
    });

    this.on('remove', function() {
      this.updateDash();
    });

    this.on('reset', function() {
      this.updateDash();
      $('body').addClass('in');
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
   },

   displayAlert: function(d) {

      var container = $('<div />').addClass('alert alert-success');

      container.text('You are magical.');

      container.prependTo('.main-stats');

      var removeAlert = setTimeout(function() {
        container.fadeOut('slow');
      }, 1000);

   }

});