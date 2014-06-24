/*
$.support.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
events: (function() {
  var events = {};
  var clickEvent = $.support.touch ? 'touchend' : 'click';
  events[clickEvent + ' .icon']  = "open";
  return events;
})()
*/

$(function() {
  App.router = new App.Router();
  Backbone.history.start();
});

App.convertToSlug = function(Text) {
  return Text
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-');
};

App.convertLargeNum = function(Num) {
  return Num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

App.configxhr = function() {
  $.getJSON( "/uploads/config", function(data) {
    var data = 'var aws_config = ' + JSON.stringify(data);
    var script = $('<script />').html(data);
    $('#header').prepend(script);
  });
};

App.getBase64Image = function(url) {
  // Get image from page
  var img = new Image();
  img.src = url;

  img.onload = function() {

    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

};

$.blueimp.fileupload.prototype.processActions.duplicateImage = function (data, options) {
  if (data.canvas) {
      data.files.push(data.files[data.index]);
  }
  return data;
};

App.dropdot = function() {

  $('.direct-upload').each(function() {
    /* For each file selected, process and upload */

    var form = $(this)

    $(this).fileupload({
      url: form.attr('action'), // Grabs form's action src
      type: 'POST',
      autoUpload: false,
      dataType: 'xml', // S3's XML response
      disableImageResize: false,
      imageMaxWidth: 800,
      imageMaxHeight: 800,
      imageCrop: false,
      processQueue: [
        {
          action: 'loadImage',
          fileTypes: /^image\/(gif|jpeg|png)$/,
          maxFileSize: 20000000 // 20MB
        },
        {
          action: 'resizeImage',
          maxWidth: 800
        },
        {action: 'saveImage'},
        {action: 'duplicateImage'},
        {
          action: 'resizeImage',
          maxWidth: 80,
        },
        {action: 'saveImage'}
      ],
      add: function (event, data) {
        $.ajax({
          url: "/uploads/signed",
          type: 'GET',
          dataType: 'json',
          data: {title: data.files[0].name}, // Send filename to /signed for the signed response
          async: false,
          success: function(data) {
            // Now that we have our data, we update the form so it contains all
            // the needed data to sign the request
            form.find('input[name=key]').val(data.key);
            form.find('input[name=policy]').val(data.policy);
            form.find('input[name=signature]').val(data.signature);
            form.find('input[name=Content-Type]').val(data.contentType);
          }
        })
        data.submit();
      },
      send: function(e, data) {
        $('.progress-bar-indication').fadeIn(); // Display widget progress bar
      },
      progress: function(e, data){
        var percent = Math.round((e.loaded / e.total) * 100)
        console.log('percent', percent);
        $('.progress-bar-indication .meter').css('width', percent + '%') // Update progress bar percentage
        $('.progress-bar-indication .meter').text(percent + '%');
      },
      fail: function(e, data) {
        console.log('fail')
      },
      success: function(data) {
        var url = $(data).find('Location').text(); // Find location value from XML response
        App.dropdot.image_store = url;
        Backbone.pubSub.trigger('image-upload-complete', App.dropdot.image_store);
      },
      done: function (event, data) {
        // When upload is done, fade out progress bar and reset to 0
        $('.progress-bar-indication').fadeOut(300, function() {
          $('.bar').css('width', 0)
        })
      },
    })
  })

};

// Extend the callbacks to work with Bootstrap, as used in this example
// See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});

$.fn.serializeObject = function () {
  "use strict";
  var a = {}, b = function (b, c) {
      var d = a[c.name];
      "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
  };
  return $.each(this.serializeArray(), b), a
};

/* Barebones Pub/Sub */
Backbone.pubSub = _.extend({}, Backbone.Events);

/* Helper Methods */
Backbone.View.prototype.close = function() {
  this.remove();
  this.unbind();
  if (this.onClose) {
    this.onClose();
  }
};

function AppView () {
  this.showView(view);

  if (this.currentView) {
   this.currentView.close();
  }

  this.currentView = view;
  this.currentView.render();

  $("#main").html(this.currentView.el);
};