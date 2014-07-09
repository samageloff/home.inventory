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

App.imager = function() {
  var url = 'api/upload',
      $loading = $('.progress-bar-indication');

  $('#fileupload').fileupload({
    url: url,
    dataType: 'json',

    add: function (e, data) {
      $loading.addClass('active');
      data.submit();
    },

    done: function (e, data) {
      $loading.removeClass('active');
      $.each(data.files, function (index, file) {
        var uri = data.result.cdnUri,
            path = data.result.uploaded[0];
        App.imager.image_store = [
          uri + '/thumb_' + path,
          uri + '/gallery_' + path,
          uri + '/large_' + path,
          path];
        Backbone.pubSub.trigger('image-upload-complete', App.imager.image_store);
      });
    }
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
