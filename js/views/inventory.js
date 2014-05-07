var formData = {};

InventoryView = Backbone.View.extend({

  el: '#items',

  events: {
    'click #add': 'addItem',
    'change #fileInput': 'readImage'
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
      this.nextStep();
    }

    else {
      fileDisplayArea.innerHTML = "File not supported!";
    }

  },

  nextStep: function(e) {

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

  initialize: function() {
    this.collection = new Inventory();
    this.collection.fetch({reset: true});
    this.listenTo(this.collection, 'add', this.renderItem);
    this.listenTo(this.collection, 'reset', this.render);
    this.render();
  },

  // render library by rendering each item in its collection
  render: function() {
    this.collection.each(function(item) {
      this.renderItem(item);
    }, this);
  },

  // render an item by creating a ItemView and appending the
  // element it renders to the inventory's element
  renderItem: function(item) {
    var itemView = new ItemView({
      model: item
    });
    $('.modal').modal('hide');
    $('#inventory-wrap').append(itemView.render().el);
  }

});