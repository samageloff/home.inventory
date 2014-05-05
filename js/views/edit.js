var app = app || {};

app.EditView = Backbone.View.extend({

  el: 'div.list',
  template: _.template($('#editTemplate').html()),

  events: {
    'click #save': 'saveItem'
  },

  initialize: function(){
    // console.log(this);
  },

  render: function() {
    console.log(this.model);
    //this.el is what we defined in tagName. use $el to get access to jQuery html() function
    // console.log(this.$el.html());
    return this;
  },

  saveItem: function(e) {
    e.preventDefault();
    console.log('saved ->', this);
  }

});

// var editView = new app.EditView();