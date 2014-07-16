App.convertToSlug = function(Text) {
  return Text
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-');
};

App.convertLargeNum = function(Num) {
  return Num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

    error: function(jqXHR, textStatus, errorThrown) {
      if (errorThrown === 'abort') {
        console.log('File Upload has been canceled');
      }
      else {
        console.log('An error has occured', errorThrown);
      }
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
  });
};

App.categoryService = function(mode) {
  function getCategories() {
    return $.ajax('api/autocomplete');
  }

  getCategories()
    .done(function(result) {
      var categories = result.suggestions;
        $('#category').autocomplete({
          lookup: categories,
          preventBadQueries: true
        });
  });

  // remove instance
  if (mode) {
    $('#category').autocomplete(mode);
  }

};

/* Helper method */
App.displayToggle = function() {
  var $trigger = $('.display-toggle').find('.trigger'),
      $siblings = $trigger.siblings();

      $trigger.on('click', function(e) {
        e.preventDefault();
        $(this).hide();
        $siblings.show().focus();
      });

};

App.fixFixed = function() {
  // Only on touch devices
  if (Modernizr.touch) {
    $("body").mobileFix({
      inputElements: "input, textarea, select",
      addClass: "fixfixed"
    });
  }
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
      "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value;
  };
  return $.each(this.serializeArray(), b), a;
};

$.fn.mobileFix = function (options) {
  var $parent = $(this),
  $fixedElements = $(options.fixedElements);

  $(document)
  .on('focus', options.inputElements, function(e) {
    $parent.addClass(options.addClass);
  })
  .on('blur', options.inputElements, function(e) {
    $parent.removeClass(options.addClass);

    // Fix for some scenarios where you need to start scrolling
    setTimeout(function() {
        $(document).scrollTop($(document).scrollTop());
    }, 1);
  });

  return this; // Allowing chaining
};

// $.support.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
// events: (function() {
//   var events = {};
//   var clickEvent = $.support.touch ? 'touchend' : 'click';
//   events[clickEvent + ' .icon']  = "open";
//   console.log(events, clickEvent);
//   return events;
// })();

/* Barebones Pub/Sub */
Backbone.pubSub = _.extend({}, Backbone.Events);


$(function() {
  App.router = new App.Router();
  Backbone.history.start();
});
