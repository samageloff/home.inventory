initialize : function (options) {
    this.options = options || {};

    this.on('reset', function() {
      this.updateStats();
    });

  },

  updateStats: function() {
    var totalCount = $('#total-count');
    var valueWrap = $('#value-wrap b');

    console.log(this);

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

    totalCount.html(this.length);
    valueWrap.html(sum);
   }