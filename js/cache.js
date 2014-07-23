var App = App || {};

App.TemplateCache = {
  get: function(selector){
    if (!this.templates){ this.templates = {}; }

    var template = this.templates[selector];
    if (!template){
      template = $(selector).html();

      // precompile the template, for underscore.js templates
      template = _.template(template);

      this.templates[selector] = template;
    }
    return template;
  }
};