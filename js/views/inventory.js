/*
$.support.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

events: (function() {

  var events = {};

  var clickEvent = $.support.touch ? 'touchend' : 'click';

  events[clickEvent + ' .icon']  = "open";

  return events;

})()
*/

var app = app || {};
var formData = {};

app.InventoryView = Backbone.View.extend({

  el: '#items',

  events: {
    'click #add': 'addItem',
    'change #fileInput': 'readImage',
    'click #next': 'nextStep',  // data-step="details"
    'click #skip':'nextStep',   // data-step="skip"
    'click #back':'nextStep',   // data-step="photo"
    'click .reset': 'reset'
  },

  readImage: function(evt) {

    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var imageType = /image.*/;

    if (file.type.match(imageType)) {
      var reader = new FileReader();

      reader.onload = function(e) {
        fileDisplayArea.innerHTML = "";

        // Create a new image.
        var img = new Image();
        // Set the img src property using the data URL.
        img.src = reader.result;

        // Add the image to the page.
        fileDisplayArea.appendChild(img);
        formData.itemImage = e.target.result;
      }

      reader.readAsDataURL(file);
      this.nextStep('details');
    }

    else {
      fileDisplayArea.innerHTML = "File not supported!";
    }

  },

  addItem: function(e) {
    e.preventDefault();

    $('#addItem').find('.collect').each(function(i, el) {
      $('#date').attr('value', Date.now());
      if($(el).val() != '') {
        formData[ el.id ] = $(el).val();
      }
    });

    this.collection.create(formData);
  },

  reset: function() {
    window.setTimeout(function() {
      $('.step-1').addClass('active');
      $('.step-2').removeClass('active');
      $('.modal-title').text('Step 1: Take a photo');
      fileDisplayArea.innerHTML = "";
    }, 350)
  },

  nextStep: function(evt) {
    var $titles = $('.modal-title');
    var $wrappers = $('.step-1, .step-2');
    var $buttons = $('#skip, #step, #next');
    var messages = ['Step 1: Take a photo', 'Step 2: Add details'];
    var path = $(evt.target).data('step');


    // photo
    if (path) {
      $titles.text(messages[0]);
      $wrappers.toggleClass('active');
    }
    // details
    if (path) {
      $titles.text(messages[1]);
      $wrappers.toggleClass('active');
    }
    // next
    if (path) {
      $buttons.toggleClass('hide');
    }
    // skip step
    if (path) {
      $titles.text(messages[1]);
      $wrappers.toggleClass('active');
    }
  },

  initialize: function() {

    this.collection = new app.Inventory();
    this.collection.fetch({reset: true});

    this.listenTo(this.collection, 'add', this.renderItem);
    this.listenTo(this.collection, 'reset', this.render);

    this.render();

  },

  // render library by rendering each book in its collection
  render: function() {
    this.collection.each(function(item) {
      console.log('item', item);
      this.renderItem(item);
    }, this);
  },

  // render an item by creating a ItemView and appending the
  // element it renders to the inventory's element
  renderItem: function(item) {
    var itemView = new app.ItemView({
      model: item
    });
    $('.modal').modal('hide');
    $('#inventory-wrap').append(itemView.render().el);
  }

});