/* Helper Methods */
Backbone.View.prototype.close = function() {
  this.remove();
  this.unbind();
  if (this.onClose) {
    this.onClose();
  }
};

function convertToSlug(Text) {
  return Text
    .toLowerCase()
    .replace(/[^\w ]+/g,'')
    .replace(/ +/g,'-');
}

function AppView() {
  this.showView(view);

  if (this.currentView) {
   this.currentView.close();
  }

  this.currentView = view;
  this.currentView.render();

  $("#main").html(this.currentView.el);
};
