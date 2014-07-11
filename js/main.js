var App = App || {};

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
var App = App || {};

App.HomeModel = Backbone.Model.extend({

  defaults: {
    _id: '',
    groups: 0,
    value: 0,
    count: 0
  },

  url: function() {
    return 'api/home/'
  },

  parse: function(response) {
    return response[0];
  }
});
var App = App || {};

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
var App = App || {};

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

  initialize: function() {
    this.on('change', function() {
      console.log('- Values for this model have changed.');
    });
    this.on('invalid', function(model, error) {
      console.log(error);
    });
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});
var App = App || {};

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

  initialize: function() {
    this.on('change', function() {
      console.log('- Values for this model have changed.');
    });
    this.on('invalid', function(model, error) {
      console.log(error);
    });
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
var App = App || {};

App.CategoryIndexCollection = Backbone.Collection.extend({
  url: 'api/categories',
  model: App.CategoryIndexModel,

  initialize: function() {
    this.on('reset', this.render, this);
    this.on('remove', this.render, this);
  }

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

  initialize: function() {
    this.collection = new App.CategoryIndexCollection();
    this.collection.fetch({reset: true});
    this.render();
    this.listenTo(this.collection, 'reset', this.render);
    Backbone.pubSub.trigger('header-default', this);
  },

  render: function() {
    this.$el.empty();
    this.collection.each(function(item) {
      this.renderCategory(item);
    }, this);
    return this;
  },

  renderCategory: function(item) {
    var categoryView = new App.CategoryIndexItemView({ model: item });
    this.$el.append(categoryView.render().el);
  },

  onClose: function() {
    console.log('on close fired');
    this.model.unbind('change', this.render);
  }

});
App.CategoryIndexItemView = Backbone.View.extend({
  template: _.template($('#category-summary-template').html()),

  render: function() {
    this.$el.empty();
    var title = this.model.get('_id'),
        totalVal = this.model.get('value'),
        markup = this.model.toJSON();

    // TODO: configure API response to include slug
    this.model.set('value', App.convertLargeNum(totalVal));

    this.setElement(this.template(markup));
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

  template: _.template($('#edit-item-template').html()),

  initialize: function() {
    _.bindAll(this, 'save');
    Backbone.Validation.bind(this);

    Backbone.pubSub.trigger('header-default', this);

    Backbone.pubSub.on('image-upload-complete', function() {
      this.getImage();
    }, this);

    Backbone.pubSub.on('image-remove', function() {
      this.unsetImage();
    }, this);

  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.setElement(this.template(markup));

    return this;
  },

  getImage: function() {
    this.model.save('image', App.imager.image_store);
  },

  removeImage: function(e) {
    e.preventDefault();

    var $self = $(e.target),
        image_id = $self.data('id');

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {
        $self.closest('.media-block').fadeOut('250');
        Backbone.pubSub.trigger('image-remove', this);
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      })
    }
    else {
      $self.closest('.media-block').fadeOut('250');
      Backbone.pubSub.trigger('image-remove', this);
    }

  },

  unsetImage: function() {
    console.log('unset image');
    this.model.unset('image');
    this.model.save();
  },

  save: function(e) {
    e.preventDefault();
    var data = $('#edit-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data['slug'] = slugVal;

    this.model.set(data);
    console.log('data', data);

    if(this.model.isValid(true)){
      this.model.save(data, {
        success: function(response, model) {
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
  },

  cancel: function(e) {
    e.preventDefault();
    this.onClose();
    App.router.navigate('#/view/' + this.model.id);
  },

  onClose: function() {
    this.model.unbind('change', this.render);
  }

});
App.HeaderView = Backbone.View.extend({
  template: _.template($('#header-template').html()),

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
    router.navigate("/new", true);
  },

  setCurrentView: function(view, config) {
    var config = config,
        location = $('.location'),
        navigation = $('.navigation');

      location.text(config.text);
      navigation.find('a')
        .addClass(config.currentClass)
        .removeClass(config.lastClass);
  },

  goBack: function(e) {
    e.preventDefault();
    App.router.navigate('#/categories');
  },

  displayHeader: function(config) {
    var config = config;
    $('#header')
      .removeClass()
      .addClass(config.display);
  }

});
App.HomeView = Backbone.View.extend({

  tagName: 'section',
  className: 'landing',
  template: _.template($('#home-template').html()),
  getStarted: _.template($('#get-started-template').html()),

  initialize: function() {
    Backbone.pubSub.trigger('header-show', this);
    Backbone.pubSub.trigger('header-home', this);
  },

  render: function() {
    this.$el.empty();
    var count = this.model.get('count');

    if (count) {
      // TODO: make this accessible
      var totalVal = this.model.get('value');
      this.model.set('value', App.convertLargeNum(totalVal));

      this.$el.html(this.template(this.model.toJSON()));
    }
    else {
      this.$el.html(this.getStarted());
    }

    return this;
  }

});
App.ImageUploadView = Backbone.View.extend({

  events: {
    'click .icon-close': 'removeImage'
  },

  template: _.template($('#image-upload-template').html()),

  initialize: function(options) {
    Backbone.pubSub.on('image-upload-complete', function() {
      this.updatePlaceholder(App.imager.image_store[3]);
    }, this);
  },

  render: function() {
    this.setElement(this.template());
    return this;
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
    placeholder.append('<img />').append('<a />')

    // find image + add image src
    placeholder.find('img').attr('src', App.imager.image_store[0]);

    // find close button add icon + href
    placeholder
      .find('a')
      .addClass('icon-close')
      .attr('href', '#')
      .attr('data-id', path)
  },

  removeImage: function(e) {
    e.preventDefault();

    var $self = $(e.target),
        image_id = $self.data('id');

    if (image_id) {
      $.get('api/remove/' + image_id, function(data) {
        $self.closest('.media-block').fadeOut('250');
        Backbone.pubSub.trigger('image-remove', this);
      })
      .fail(function() {
        console.log('Failed to remove the image.');
      })
    }

  }

});
App.ItemListView = Backbone.View.extend({

  tagName: 'section',
  className: 'items grid-items-lines',

  initialize: function() {
    _.bindAll(this, 'render');

    this.collection = new App.ItemListCollection();
    this.collection.fetch({reset: true});
    this.render();

    this.listenTo(this.collection, 'reset', this.render);
    Backbone.pubSub.trigger('header-show', this);
    Backbone.pubSub.trigger('item-list', this);
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

  onClose: function(){
    this.model.unbind('change', this.render);
  }

});
var App = App || {};

App.ItemView = Backbone.View.extend({
  events: {
    'click .edit': 'edit',
    'click .delete': 'delete'
  },
  template: _.template($('#category-items-template').html()),

  render: function() {
    var markup = this.model.toJSON();
    this.$el.empty();
    this.setElement(this.template(markup));
    return this;
  },

  edit: function(e) {
    e.preventDefault();
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
        })
      }

      this.model.destroy();
      this.remove();

      if (collection_length > 1) {
        App.router.navigate('#/category/' + category);
      }
      else {
        App.router.navigate('#/categories');
      }

    }
  }
});
App.NewItemView = Backbone.View.extend({

  events: {
    'submit #new-item-form': 'save',
    'click #save': 'save',
    'click #cancel': 'cancel'
  },

  template: _.template($('#new-item-template').html()),

  initialize: function() {
    _.bindAll(this, 'save');
    Backbone.Validation.bind(this);

    Backbone.pubSub.trigger('header-default', this);
    Backbone.pubSub.trigger('header-hide', this);

    // Listen for image upload and pass to current model
    Backbone.pubSub.on('image-upload-complete', function() {
      this.setImagePath();
    }, this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.setElement(this.template(markup));

    return this;
  },

  setImagePath: function() {
    this.model.set('image', App.imager.image_store);
  },

  save: function(e) {
    e.preventDefault();
    var data = $('#new-item-form').serializeObject();
    var value = $(e.currentTarget).val();
    var slugVal = App.convertToSlug($('#category').val());
    data['slug'] = slugVal;

    this.model.set(data);

    if(this.model.isValid(true)){
      this.model.save(data, {
        success: function(response, model) {
          App.router.navigate('#/view/' + model.id);
        }
      });
    }
  },

  cancel: function(e) {
    e.preventDefault();
    this.onClose();
    App.router.navigate('#/');
  },

  onClose: function() {
    this.model.unbind('change', this.render);
  }

});
App.SingleItemView = Backbone.View.extend({

  events: {
    'click .icon-close': 'close',
    'click .icon-edit': 'edit',
    'click .icon-trash': 'trash'
  },
  template: _.template($('#single-view-template').html()),

  initialize: function() {
    Backbone.pubSub.trigger('header-hide', this);
  },

  render: function() {
    var markup = this.model.toJSON();

    this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
    return this;

    this.setElement(this.template(markup));
  },

  close: function(e) {
    e.preventDefault();
    App.router.navigate("#/category/" + this.model.get('slug'), true);
  },

  edit: function() {
    App.router.navigate("/edit/" + this.model.id, true);
  },

  trash: function() {
    if (window.confirm('Are you sure?')) {
      this.model.destroy();
      this.remove();
      App.router.navigate("/", true);
    }
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
    var categoryIndexView = new App.CategoryIndexView();
    $('#main').html(categoryIndexView.render().el);
  },

  groupList: function(id) {
    var category = new App.ItemListModel({ id: id });
    var categoryListView = new App.ItemListView({ model: category });
    $('#main').html(categoryListView.render().el);
  },

  edit: function(id) {
    var model = new App.SingleItemModel({ id: id }),
        imageUploadView = new App.ImageUploadView();
    model.fetch({
      success: function() {
        var singleItemEditView = new App.SingleItemEditView({ model: model });
        $('#main')
          .html(singleItemEditView.render().el)
          .prepend(imageUploadView.render().el);
        App.imager();
      }
    });
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
        var newItemView = new App.NewItemView({ model: model }),
            imageUploadView = new App.ImageUploadView();
        $('#main')
          .html(newItemView.render().el)
          .prepend(imageUploadView.render().el);
        App.imager();
        App.categoryService();
      }
    });
  },

  notFound: function() {
    $('#main').html('<h1>It\'s broken</h1>');
  }

});
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

App.categoryService = function() {
  $('#category').autocomplete({
    serviceUrl: '/api/autocomplete',
    transformResult: function(response) {
      console.log(response);
      return {
        suggestions: $.map(response, function(dataItem) {
          return { value: dataItem.valueField, data: dataItem.dataField };
        })
      };
    },
    onSelect: function (suggestion) {
      alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    }
  });
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
