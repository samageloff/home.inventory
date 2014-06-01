/*
$.support.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
events: (function() {
  var events = {};
  var clickEvent = $.support.touch ? 'touchend' : 'click';
  events[clickEvent + ' .icon']  = "open";
  return events;
})()
*/

var router = new Router();
Backbone.history.start();

convertToSlug = function(Text) {
  return Text
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-');
};