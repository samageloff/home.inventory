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
App.CategoryIndexModel = Backbone.Model.extend({
  defaults: {
    _id: '',
    groups: 0,
    description: '',
    slug: '',
    value: 0,
    count: 0
  }
});
App.HomeModel = Backbone.Model.extend({

  defaults: {
    _id: '',
    groups: 0,
    value: 0,
    count: 0
  },

  url: function() {
    return 'api/home/';
  },

  parse: function(response) {
    return response[0];
  }
});
App.ItemListModel = Backbone.Model.extend({
  defaults: {
    title: '',
    category: '',
    description: '',
    slug: '',
    image: '',
    quantity: 0,
    value: 0
  },

  initialize: function() {
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});
App.NewItemModel = Backbone.Model.extend({

  urlRoot: 'api/items/',

  defaults: {
    title: '',
    category: '',
    description: '',
    slug: '',
    image: [],
    quantity: 0,
    value: 0
  },

  validation: {
    title: {
      required: true,
      msg: 'Please enter a title.'
    },
    category: {
      required: true,
      msg: 'Please enter a category.'
    },
    value: {
      pattern: 'digits',
      msg: 'Please. Numbers only.'
    }
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});
App.SingleItemModel = Backbone.Model.extend({

  events: {
    'click .icon-edit': 'edit'
  },

  url: function() {
    return 'api/items/' + this.id;
  },

  defaults: {
    title: '',
    category: '',
    description: '',
    slug: '',
    image: '',
    quantity: 0,
    value: 0
  },

  validation: {
    title: {
      required: true,
      msg: 'Please enter a title'
    },
    category: {
      required: true,
      msg: 'Please enter a category'
    }
  },

  edit: function(e) {
    e.preventDefault();
    this.onClose();
    var id = this.model.get('id');
    router.navigate('edit/'+id, true);
  },

  onClose: function() {
    this.model.unbind('change', this.render);
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});
App.CategoryIndexCollection = Backbone.Collection.extend({
  url: 'api/categories',
  model: App.CategoryIndexModel,
});
var App = App || {};

App.HomeCollection = Backbone.Collection.extend({
  url: 'api/home',
  model: App.CategoryIndexModel
});
var App = App || {};

App.ItemListCollection = Backbone.Collection.extend({

  initialize : function (options) {
    this.options = options || {};
    this.fragment = Backbone.history.fragment;
  },

  model: App.ItemListModel,

  url: function() {
    return 'api/' + this.fragment;
  }

});
App.CategoryIndexView = Backbone.View.extend({

  tagName: 'section',
  className: 'groups grid-items-lines',

  events: {
    'click .grid-item': 'close'
  },

  initialize: function() {
    Backbone.pubSub.trigger('header-default', this);
    this.listenTo(this.collection, 'reset', this.render);
  },

  render: function() {
    this.$el.empty();

    // if there are no categories, redirect
    if (this.collection.length === 0) {
      App.router.navigate('#/');
    }

    // iterate over collection and create subview
    // for each category item
    else {
      this.collection.each(function(item) {
        this.renderCategory(item);
      }, this);
    }
    return this;
  },

  renderCategory: function(item) {
    var categoryView = new App.CategoryIndexItemView({ model: item });
    this.$el.append(categoryView.render().el);
  },

  close: function() {
    console.log('Kill:App.CategoryIndexView ', this);
    this.unbind();
    this.remove();
  }

});
App.CategoryIndexItemView = Backbone.View.extend({

  template: App.TemplateCache.get('#category-summary-template'),

  render: function() {
    this.$el.empty();
    var title = this.model.get('_id'),
        totalVal = this.model.get('value'),
        markup = this.model.toJSON();

    // TODO: configure API response to include slug
    this.model.set('value', App.convertLargeNum(totalVal));

    this.$el.html(this.template(markup)).fadeIn('fast');
    return this;
  }

});
App.SingleItemEditView = Backbone.View.extend({

  events: {
    'submit #edit-item-form': 'save',
    'click #save': 'save',
    'click #cancel': 'cancel',
    'click .icon-close': 'removeImage'
  },

  template: App.TemplateCache.get('#edit-item-template'),

  initialize: function() {
    _.bindAll(this, 'save');
    Backbone.Validation.bind(this);

    Backbone.pubSub.trigger('header-hide', this);

    Backbone.pubSub.on('image-upload-complete', function() {
      this.setImagePath();
    }, this);

    Backbone.pubSub.on('image-remove', function() {
      this.unsetImage();
    }, this);

  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(markup)).fadeIn('fast');

    return this;
  },

  setImagePath: function() {
    this.model.save('image', App.imager.image_store);
    this.updatePlaceholder(App.imager.image_store[3]);
  },

  updatePlaceholder: function(src) {
    var $placeholder = $('.upload-placeholder'),
        $uploadButton = $('.direct-upload'),
        path = src;

    // clear placeholder
    // TODO: this may eventually be an array
    // handle it, hacky
    $placeholder.empty();
    $('#upload-placeholder').empty();
    $uploadButton.hide();

    // add image + close button
    $placeholder.append('<img />').append('<a />').fadeIn('fast');

    // find image + add image src
    $placeholder.find('img').attr('src', App.imager.image_store[0]);

    // find close button add icon + href
    $placeholder
      .find('a')
      .addClass('icon-close')
      .attr('href', '#')
      .attr('data-id', path);
  },

  removeImage: function(e) {
    e.preventDefault();

    var $self = $(e.target),
        image_id = $self.data('id');

        console.log('image_id', image_id);

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {

        console.log('data', data);

        $self.closest('.media-block').find('img').remove();
        $self.remove();
        Backbone.pubSub.trigger('image-remove', this);
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      });
    }
    else {
      $self.closest('.media-block').fadeOut('250');
    }

  },

  unsetImage: function() {
    console.log('unset image');
    this.model.unset('image');
    this.model.save();
  },

  save: function(e) {
    e.preventDefault();
    var self = this;
    var data = $('#edit-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data.slug = slugVal;

    this.model.set(data);
    console.log('data', data);

    if(this.model.isValid(true)){
      this.model.save(data, {
        success: function(response, model) {
          self.close();
          App.router.navigate('#/view/' + model.id);
        },
        error: function(model, xhr, options) {
          alert(xhr.responseText);
          App.router.navigate('#/');
        }
      });
    }
  },

  cancel: function(e) {
    e.preventDefault();
    this.close();
    App.router.navigate('#/view/' + this.model.id);
  },

  close: function() {
    console.log('Kill:App.SingleItemEditView ', this);
    App.categoryService('dispose');
    this.unbind();
    this.remove();
  }

});
App.HeaderView = Backbone.View.extend({

  template: App.TemplateCache.get('#header-template'),

  events: {
    'click .new' : 'newItem',
    'click .icon-back': 'goBack'
  },

  initialize: function() {
    this.render();

    Backbone.pubSub.on('header-default', function() {
      this.setCurrentView('header-default', {
        'text': '',
        'currentClass': 'icon-home',
        'lastClass': 'icon-back'
      });
    }, this);

    Backbone.pubSub.on('item-list', function() {
      this.setCurrentView('item-list', {
        'text': Backbone.history.fragment.split('/')[1],
        'currentClass': 'icon-back',
        'lastClass': 'icon-home'
      });
    }, this);

    Backbone.pubSub.on('header-hide', function() {
      this.displayHeader({
        'display': 'hide'
      });
    }, this);

    Backbone.pubSub.on('header-show', function() {
      this.displayHeader({
        'display': 'show'
      });
    }, this);

  },

  render: function () {
    $(this.el).html(this.template());
    return this;
  },

  newItem: function () {
    this.close();
    App.router.navigate("/new", true);
  },

  setCurrentView: function(view, config) {
    var conf = config,
        location = $('.location'),
        navigation = $('.navigation');

      location.text(conf.text);
      navigation.find('a')
        .addClass(conf.currentClass)
        .removeClass(conf.lastClass);
  },

  goBack: function(e) {
    e.preventDefault();
    Backbone.pubSub.trigger('remove-category-list', this);
    App.router.navigate('#/categories');
  },

  displayHeader: function(config) {
    var conf = config;
    $('#header')
      .removeClass()
      .addClass(conf.display);
  }

});
App.HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: App.TemplateCache.get('#home-template'),

  events: {
    'click #add-item': 'addItem',
    'click #browse-categories': 'browseCategories'
  },

  initialize: function() {
    Backbone.pubSub.trigger('header-show', this);
    Backbone.pubSub.trigger('header-home', this);
  },

  render: function() {
    this.$el.empty();
    this.setHomeView();
    return this;
  },

  setHomeView: function() {
    var markup = this.model.toJSON(),
        count = this.model.get('count');

    if (count) {
      var totalVal = this.model.get('value');
      this.model.set('value', App.convertLargeNum(totalVal));
    }

    this.$el.html(this.template(markup)).fadeIn('fast');
  },

  addItem: function() {
    this.close();
    App.router.navigate('/new', {trigger: true});
  },

  browseCategories: function() {
    this.close();
    App.router.navigate('/categories', {trigger: true});
  },

  close: function() {
    console.log('Kill:App.HomeView ', this);
    this.unbind();
    this.remove();
  }

});
App.ItemListView = Backbone.View.extend({

  tagName: 'section',
  className: 'items grid-items-lines',

  events: {
    'click .grid-item': 'close'
  },

  initialize: function() {
    Backbone.pubSub.trigger('header-show', this);
    Backbone.pubSub.trigger('item-list', this);
    Backbone.pubSub.on('remove-category-list', function() {
      this.close();
    }, this);

    this.listenTo(this.collection, 'reset', this.render);
  },

  render: function() {
    this.$el.empty();
    this.collection.each(function(item) {
      this.renderCategory(item);
    }, this);

    return this;
  },

  renderCategory: function(item) {
    var categoryListView = new App.ItemView({ model: item });
    this.$el.append(categoryListView.render().el);
  },

  close: function() {
    console.log('Kill:App.ItemListView ', this);
    this.unbind();
    this.remove();
  }

});
var App = App || {};

App.ItemView = Backbone.View.extend({
  events: {
    'click .edit': 'edit',
    'click .delete': 'delete'
  },
  template: App.TemplateCache.get('#category-items-template'),

  render: function() {
    var markup = this.model.toJSON();
    this.$el.empty();
    this.$el.html(this.template(markup)).fadeIn('fast');
    return this;
  },

  edit: function(e) {
    e.preventDefault();
    this.close();
    App.router.navigate('#/edit/' + this.model.id);
  },

  delete: function(e) {
    var collection_length = this.model.collection.length,
        category = this.model.get('slug');

    e.preventDefault();

    if (window.confirm('Are you sure?')) {

      var $self = $(e.target),
          image_id = $self.data('id');

      if (image_id) {
        $.get('api/remove/' + image_id, function(data) {
          Backbone.pubSub.trigger('image-remove', this);
        })
        .fail(function() {
          console.log('Failed to remove the image.');
        });
      }

      this.model.destroy();
      this.close();

      if (collection_length > 1) {
        App.router.navigate('#/category/' + category);
      }
      else {
        App.router.navigate('#/categories');
      }

    }

    e.stopImmediatePropagation();

  },

  close: function() {
    console.log('Kill:App.ItemView ', this);
    this.unbind();
    this.remove();
  }

});
App.NewItemView = Backbone.View.extend({

  events: {
    'submit #new-item-form': 'save',
    'click #save': 'save',
    'click #cancel': 'cancel',
    'click .icon-close': 'removeImage'
  },

  template: App.TemplateCache.get('#new-item-template'),

  initialize: function() {
    _.bindAll(this, 'save');
    Backbone.Validation.bind(this);
    Backbone.pubSub.trigger('header-hide', this);
    Backbone.pubSub.trigger('header-default', this);

    // Listen for image upload and pass to current model
    Backbone.pubSub.on('image-upload-complete', function() {
      this.setImagePath();
    }, this);
  },

  render: function() {
    var markup = this.model.toJSON();
    this.$el.html(this.template(markup)).fadeIn('fast');
    return this;
  },

  setImagePath: function() {
    this.model.set('image', App.imager.image_store);
    this.updatePlaceholder(App.imager.image_store[3]);
  },

  save: function(e) {
    e.preventDefault();
    var data = $('#new-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data.slug = slugVal;

    this.model.set(data);

    if(this.model.isValid(true)) {
      this.model.save(data, {
        success: function(response, model) {
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
  },

  updatePlaceholder: function(src) {
    var placeholder = $('.upload-placeholder'),
        path = src;

    // clear placeholder
    // TODO: this may eventually be an array
    // handle it, hacky
    placeholder.empty();
    $('#upload-placeholder').empty();

    // add image + close button
    placeholder.append('<img />').append('<a />').fadeIn('fast');

    // find image + add image src
    placeholder.find('img').attr('src', App.imager.image_store[0]);

    // find close button add icon + href
    placeholder
      .find('a')
      .addClass('icon-close')
      .attr('href', '#')
      .attr('data-id', path);
  },

  removeImage: function(e) {
    e.preventDefault();

    var $self = $(e.target).closest('.media-block'),
        image_id = $self.data('id');

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {
        $self.find('img, a').remove();
        $self.append('<div />').addClass('.progress-bar-indication');
        Backbone.pubSub.trigger('image-remove', this);
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      });
    }
  },

  cancel: function(e) {
    e.preventDefault();
    this.close();
    App.router.navigate('#/');
  },

  close: function() {
    console.log('Kill:App.NewItemView ', this);
    App.categoryService('dispose');
    this.unbind();
    this.remove();
  }

});
App.SingleItemView = Backbone.View.extend({

  events: {
    'click .icon-close': 'collapse',
    'click .icon-edit': 'edit',
    'click .icon-trash': 'trash'
  },

  template: App.TemplateCache.get('#single-view-template'),

  initialize: function() {
    Backbone.pubSub.trigger('header-hide', this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(markup)).fadeIn('slow');
    return this;
  },

  collapse: function(e) {
    e.preventDefault();
    this.close();
    App.router.navigate("#/category/" + this.model.get('slug'), true);
  },

  edit: function() {
    this.close();
    App.router.navigate("/edit/" + this.model.id, true);
  },

  trash: function(e) {
    if (window.confirm('Are you sure?')) {
      this.removeImage(e);
      this.model.destroy();
      this.close();
      App.router.navigate("/", true);
    }
  },

  removeImage: function(e) {
    var $self = $(e.target),
        image_id = $self.data('id');

        console.log('image_id', image_id);

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      });
    }

  },

  close: function() {
    console.log('Kill:App.SingleItemView ', this);
    this.unbind();
    this.remove();
  }

});
App.Router = Backbone.Router.extend({

  routes: {
    '': 'home',
    'categories': 'categoryList',
    'category/:id': 'groupList',
    'group/:id': 'groupList',
    'edit/:id': 'edit',
    'view/:id': 'view',
    'new': 'new',
    '*notFound': 'notFound'
  },

  initialize: function () {
    var headerView = new App.HeaderView();
    $('#header').html(headerView.render().el);
  },

  home: function() {
    var model = new App.HomeModel();
    model.fetch({
      success: function() {
        var homeView = new App.HomeView({ model: model });
        $('#main').html(homeView.render().el);
      }
    });
  },

  categoryList: function(id) {
    var categoryCollection = new App.CategoryIndexCollection();
    categoryCollection.fetch({ success: function(categoryCollection) {
      var categoryIndexView = new App.CategoryIndexView({collection: categoryCollection});
      $('#main').html(categoryIndexView.render().el);
    }});
  },

  groupList: function(id) {
    var itemCollection = new App.ItemListCollection();
    itemCollection.fetch({ success: function(itemCollection) {
      console.log(itemCollection);
      var categoryListView = new App.ItemListView({ collection: itemCollection });
      $('#main').html(categoryListView.render().el);
    }});
  },

  view: function(id) {
    var model = new App.SingleItemModel({ id: id });
    model.fetch({
      success: function() {
        var singleItemView = new App.SingleItemView({ model: model });
        $('#main').html(singleItemView.render().el);
      }
    });
  },

  new: function() {
    var model = new App.NewItemModel();
    model.fetch({
      success: function() {
        var newItemView = new App.NewItemView({ model: model });
        $('#main').html(newItemView.render().el);
        App.imager();
        App.categoryService();
        App.displayToggle();
        App.fixFixed();
      }
    });
  },

  edit: function(id) {
    var model = new App.SingleItemModel({ id: id });
    model.fetch({
      success: function() {
        var singleItemEditView = new App.SingleItemEditView({ model: model });
        $('#main').html(singleItemEditView.render().el);
        App.imager();
        App.categoryService();
        App.displayToggle();
      }
    });
  },

  notFound: function() {
    $('#main').html('<h1>It\'s broken</h1>');
  }

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
      if (errorThrown) {
        $loading.removeClass('active');
        $loading.parent().text('There\'s been an error: ' + errorThrown);
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