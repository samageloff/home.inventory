var App=App||{};App.CategoryIndexModel=Backbone.Model.extend({defaults:{_id:"",groups:0,description:"",slug:"",value:0,count:0}});var App=App||{};App.HomeModel=Backbone.Model.extend({defaults:{_id:"",groups:0,value:0,count:0},url:function(){return"api/home/"},parse:function(a){return a[0]}});var App=App||{};App.ItemListModel=Backbone.Model.extend({defaults:{title:"",category:"",description:"",slug:"",image:"",quantity:0,value:0},initialize:function(){},parse:function(a){return a.id=a._id,a}});var App=App||{};App.NewItemModel=Backbone.Model.extend({urlRoot:"api/items/",defaults:{title:"",category:"",description:"",slug:"",image:[],quantity:0,value:0},validation:{title:{required:!0,msg:"Please enter a title."},category:{required:!0,msg:"Please enter a category."},value:{pattern:"digits",msg:"Please. Numbers only."}},parse:function(a){return a.id=a._id,a}});var App=App||{};App.SingleItemModel=Backbone.Model.extend({events:{"click .icon-edit":"edit"},url:function(){return"api/items/"+this.id},defaults:{title:"",category:"",description:"",slug:"",image:"",quantity:0,value:0},validation:{title:{required:!0,msg:"Please enter a title"},category:{required:!0,msg:"Please enter a category"}},edit:function(a){a.preventDefault(),this.onClose();var b=this.model.get("id");router.navigate("edit/"+b,!0)},onClose:function(){this.model.unbind("change",this.render)},parse:function(a){return a.id=a._id,a}}),App.CategoryIndexCollection=Backbone.Collection.extend({url:"api/categories",model:App.CategoryIndexModel});var App=App||{};App.HomeCollection=Backbone.Collection.extend({url:"api/home",model:App.CategoryIndexModel});var App=App||{};App.ItemListCollection=Backbone.Collection.extend({initialize:function(a){this.options=a||{},this.fragment=Backbone.history.fragment},model:App.ItemListModel,url:function(){return"api/"+this.fragment}}),App.CategoryIndexView=Backbone.View.extend({tagName:"section",className:"groups grid-items-lines",events:{"click .grid-item":"close"},initialize:function(){Backbone.pubSub.trigger("header-default",this),this.listenTo(this.collection,"reset",this.render)},render:function(){return this.$el.empty(),0===this.collection.length?App.router.navigate("#/"):this.collection.each(function(a){this.renderCategory(a)},this),this},renderCategory:function(a){var b=new App.CategoryIndexItemView({model:a});this.$el.append(b.render().el)},close:function(){console.log("Kill:App.CategoryIndexView ",this),this.unbind(),this.remove()}}),App.CategoryIndexItemView=Backbone.View.extend({template:_.template($("#category-summary-template").html()),render:function(){this.$el.empty();var a=(this.model.get("_id"),this.model.get("value")),b=this.model.toJSON();return this.model.set("value",App.convertLargeNum(a)),this.$el.html(this.template(b)).fadeIn("fast"),this}}),App.SingleItemEditView=Backbone.View.extend({events:{"submit #edit-item-form":"save","click #save":"save","click #cancel":"cancel","click .icon-close":"removeImage"},template:_.template($("#edit-item-template").html()),initialize:function(){_.bindAll(this,"save"),Backbone.Validation.bind(this),Backbone.pubSub.trigger("header-hide",this),Backbone.pubSub.on("image-upload-complete",function(){this.setImagePath()},this),Backbone.pubSub.on("image-remove",function(){this.unsetImage()},this)},render:function(){var a=this.model.toJSON();return this.$el.empty(),this.$el.html(this.template(a)).fadeIn("fast"),this},setImagePath:function(){this.model.save("image",App.imager.image_store),this.updatePlaceholder(App.imager.image_store[3])},updatePlaceholder:function(a){var b=$(".upload-placeholder"),c=$(".direct-upload"),d=a;b.empty(),$("#upload-placeholder").empty(),c.hide(),b.append("<img />").append("<a />").fadeIn("fast"),b.find("img").attr("src",App.imager.image_store[0]),b.find("a").addClass("icon-close").attr("href","#").attr("data-id",d)},removeImage:function(a){a.preventDefault();var b=$(a.target),c=b.data("id");console.log("image_id",c),c?$.get("api/remove/"+c,function(a){console.log("data",a),b.closest(".media-block").find("img").remove(),b.remove(),Backbone.pubSub.trigger("image-remove",this)}).fail(function(){console.log("Failed to remove the image.")}):b.closest(".media-block").fadeOut("250")},unsetImage:function(){console.log("unset image"),this.model.unset("image"),this.model.save()},save:function(a){a.preventDefault();var b=this,c=$("#edit-item-form").serializeObject(),d=($(a.currentTarget).val(),App.convertToSlug($("#category").val()));c.slug=d,this.model.set(c),console.log("data",c),this.model.isValid(!0)&&this.model.save(c,{success:function(a,c){b.close(),App.router.navigate("#/view/"+c.id)},error:function(a,b){alert(b.responseText),App.router.navigate("#/")}})},cancel:function(a){a.preventDefault(),this.close(),App.router.navigate("#/view/"+this.model.id)},close:function(){console.log("Kill:App.SingleItemEditView ",this),App.categoryService("dispose"),this.unbind(),this.remove()}}),App.HeaderView=Backbone.View.extend({template:_.template($("#header-template").html()),events:{"click .new":"newItem","click .icon-back":"goBack"},initialize:function(){this.render(),Backbone.pubSub.on("header-default",function(){this.setCurrentView("header-default",{text:"",currentClass:"icon-home",lastClass:"icon-back"})},this),Backbone.pubSub.on("item-list",function(){this.setCurrentView("item-list",{text:Backbone.history.fragment.split("/")[1],currentClass:"icon-back",lastClass:"icon-home"})},this),Backbone.pubSub.on("header-hide",function(){this.displayHeader({display:"hide"})},this),Backbone.pubSub.on("header-show",function(){this.displayHeader({display:"show"})},this)},render:function(){return $(this.el).html(this.template()),this},newItem:function(){this.close(),App.router.navigate("/new",!0)},setCurrentView:function(a,b){var c=b,d=$(".location"),e=$(".navigation");d.text(c.text),e.find("a").addClass(c.currentClass).removeClass(c.lastClass)},goBack:function(a){a.preventDefault(),Backbone.pubSub.trigger("remove-category-list",this),App.router.navigate("#/categories")},displayHeader:function(a){var b=a;$("#header").removeClass().addClass(b.display)}}),App.HomeView=Backbone.View.extend({tagName:"section",className:"landing",template:_.template($("#home-template").html()),events:{"click #add-item":"addItem","click #browse-categories":"browseCategories"},initialize:function(){Backbone.pubSub.trigger("header-show",this),Backbone.pubSub.trigger("header-home",this)},render:function(){return this.$el.empty(),this.setHomeView(),this},setHomeView:function(){var a=this.model.toJSON(),b=this.model.get("count");if(b){var c=this.model.get("value");this.model.set("value",App.convertLargeNum(c))}this.$el.html(this.template(a)).fadeIn("fast")},addItem:function(){this.close(),App.router.navigate("/new",{trigger:!0})},browseCategories:function(){this.close(),App.router.navigate("/categories",{trigger:!0})},close:function(){console.log("Kill:App.HomeView ",this),this.unbind(),this.remove()}}),App.ItemListView=Backbone.View.extend({tagName:"section",className:"items grid-items-lines",events:{"click .grid-item":"close"},initialize:function(){Backbone.pubSub.trigger("header-show",this),Backbone.pubSub.trigger("item-list",this),Backbone.pubSub.on("remove-category-list",function(){this.close()},this),this.listenTo(this.collection,"reset",this.render)},render:function(){return this.$el.empty(),this.collection.each(function(a){this.renderCategory(a)},this),this},renderCategory:function(a){var b=new App.ItemView({model:a});this.$el.append(b.render().el)},close:function(){console.log("Kill:App.ItemListView ",this),this.unbind(),this.remove()}});var App=App||{};App.ItemView=Backbone.View.extend({events:{"click .edit":"edit","click .delete":"delete"},template:_.template($("#category-items-template").html()),render:function(){var a=this.model.toJSON();return this.$el.empty(),this.$el.html(this.template(a)).fadeIn("fast"),this},edit:function(a){a.preventDefault(),this.close(),App.router.navigate("#/edit/"+this.model.id)},"delete":function(a){var b=this.model.collection.length,c=this.model.get("slug");if(a.preventDefault(),window.confirm("Are you sure?")){var d=$(a.target),e=d.data("id");e&&$.get("api/remove/"+e,function(){Backbone.pubSub.trigger("image-remove",this)}).fail(function(){console.log("Failed to remove the image.")}),this.model.destroy(),this.close(),App.router.navigate(b>1?"#/category/"+c:"#/categories")}a.stopImmediatePropagation()},close:function(){console.log("Kill:App.ItemView ",this),this.unbind(),this.remove()}}),App.NewItemView=Backbone.View.extend({events:{"submit #new-item-form":"save","click #save":"save","click #cancel":"cancel","click .icon-close":"removeImage"},template:_.template($("#new-item-template").html()),initialize:function(){_.bindAll(this,"save"),Backbone.Validation.bind(this),Backbone.pubSub.trigger("header-hide",this),Backbone.pubSub.trigger("header-default",this),Backbone.pubSub.on("image-upload-complete",function(){this.setImagePath()},this)},render:function(){var a=this.model.toJSON();return this.$el.html(this.template(a)).fadeIn("fast"),this},setImagePath:function(){this.model.set("image",App.imager.image_store),this.updatePlaceholder(App.imager.image_store[3])},save:function(a){a.preventDefault();var b=$("#new-item-form").serializeObject(),c=($(a.currentTarget).val(),App.convertToSlug($("#category").val()));b.slug=c,this.model.set(b),this.model.isValid(!0)&&this.model.save(b,{success:function(a,b){App.router.navigate("#/view/"+b.id)}})},updatePlaceholder:function(a){var b=$(".upload-placeholder"),c=a;b.empty(),$("#upload-placeholder").empty(),b.append("<img />").append("<a />").fadeIn("fast"),b.find("img").attr("src",App.imager.image_store[0]),b.find("a").addClass("icon-close").attr("href","#").attr("data-id",c)},removeImage:function(a){a.preventDefault();var b=$(a.target).closest(".media-block"),c=b.data("id");c&&$.get("api/remove/"+c,function(){b.find("img, a").remove(),b.append("<div />").addClass(".progress-bar-indication"),Backbone.pubSub.trigger("image-remove",this)}).fail(function(){console.log("Failed to remove the image.")})},cancel:function(a){a.preventDefault(),this.close(),App.router.navigate("#/")},close:function(){console.log("Kill:App.NewItemView ",this),App.categoryService("dispose"),this.unbind(),this.remove()}}),App.SingleItemView=Backbone.View.extend({events:{"click .icon-close":"collapse","click .icon-edit":"edit","click .icon-trash":"trash"},template:_.template($("#single-view-template").html()),initialize:function(){Backbone.pubSub.trigger("header-hide",this)},render:function(){var a=this.model.toJSON();return this.$el.empty(),this.$el.html(this.template(a)).fadeIn("slow"),this},collapse:function(a){a.preventDefault(),this.close(),App.router.navigate("#/category/"+this.model.get("slug"),!0)},edit:function(){this.close(),App.router.navigate("/edit/"+this.model.id,!0)},trash:function(a){window.confirm("Are you sure?")&&(this.removeImage(a),this.model.destroy(),this.close(),App.router.navigate("/",!0))},removeImage:function(a){var b=$(a.target),c=b.data("id");console.log("image_id",c),c&&$.get("api/remove/"+c,function(){}).fail(function(){console.log("Failed to remove the image.")})},close:function(){console.log("Kill:App.SingleItemView ",this),this.unbind(),this.remove()}}),App.Router=Backbone.Router.extend({routes:{"":"home",categories:"categoryList","category/:id":"groupList","group/:id":"groupList","edit/:id":"edit","view/:id":"view","new":"new","*notFound":"notFound"},initialize:function(){var a=new App.HeaderView;$("#header").html(a.render().el)},home:function(){var a=new App.HomeModel;a.fetch({success:function(){var b=new App.HomeView({model:a});$("#main").html(b.render().el)}})},categoryList:function(){var a=new App.CategoryIndexCollection;a.fetch({success:function(a){var b=new App.CategoryIndexView({collection:a});$("#main").html(b.render().el)}})},groupList:function(){var a=new App.ItemListCollection;a.fetch({success:function(a){console.log(a);var b=new App.ItemListView({collection:a});$("#main").html(b.render().el)}})},view:function(a){var b=new App.SingleItemModel({id:a});b.fetch({success:function(){var a=new App.SingleItemView({model:b});$("#main").html(a.render().el)}})},"new":function(){var a=new App.NewItemModel;a.fetch({success:function(){var b=new App.NewItemView({model:a});$("#main").html(b.render().el),App.imager(),App.categoryService(),App.displayToggle(),App.fixFixed()}})},edit:function(a){var b=new App.SingleItemModel({id:a});b.fetch({success:function(){var a=new App.SingleItemEditView({model:b});$("#main").html(a.render().el),App.imager(),App.categoryService(),App.displayToggle()}})},notFound:function(){$("#main").html("<h1>It's broken</h1>")}}),App.convertToSlug=function(a){return a.toLowerCase().replace(/[^\w ]+/g,"").replace(/ +/g,"-")},App.convertLargeNum=function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")},App.imager=function(){var a="api/upload",b=$(".progress-bar-indication");$("#fileupload").fileupload({url:a,dataType:"json",add:function(a,c){b.addClass("active"),c.submit()},error:function(a,b,c){"abort"===c?console.log("File Upload has been canceled"):console.log("An error has occured",c)},done:function(a,c){b.removeClass("active"),$.each(c.files,function(){var a=c.result.cdnUri,b=c.result.uploaded[0];App.imager.image_store=[a+"/thumb_"+b,a+"/gallery_"+b,a+"/large_"+b,b],Backbone.pubSub.trigger("image-upload-complete",App.imager.image_store)})}})},App.categoryService=function(a){function b(){return $.ajax("api/autocomplete")}b().done(function(a){var b=a.suggestions;$("#category").autocomplete({lookup:b,preventBadQueries:!0})}),a&&$("#category").autocomplete(a)},App.displayToggle=function(){var a=$(".display-toggle").find(".trigger"),b=a.siblings();a.on("click",function(a){a.preventDefault(),$(this).hide(),b.show().focus()})},App.fixFixed=function(){Modernizr.touch&&$("body").mobileFix({inputElements:"input, textarea, select",addClass:"fixfixed"})},_.extend(Backbone.Validation.callbacks,{valid:function(a,b){var c=a.$("[name="+b+"]"),d=c.closest(".form-group");d.removeClass("has-error"),d.find(".help-block").html("").addClass("hidden")},invalid:function(a,b,c){var d=a.$("[name="+b+"]"),e=d.closest(".form-group");e.addClass("has-error"),e.find(".help-block").html(c).removeClass("hidden")}}),$.fn.serializeObject=function(){"use strict";var a={},b=function(b,c){var d=a[c.name];"undefined"!=typeof d&&null!==d?$.isArray(d)?d.push(c.value):a[c.name]=[d,c.value]:a[c.name]=c.value};return $.each(this.serializeArray(),b),a},$.fn.mobileFix=function(a){{var b=$(this);$(a.fixedElements)}return $(document).on("focus",a.inputElements,function(){b.addClass(a.addClass)}).on("blur",a.inputElements,function(){b.removeClass(a.addClass),setTimeout(function(){$(document).scrollTop($(document).scrollTop())},1)}),this},Backbone.pubSub=_.extend({},Backbone.Events),$(function(){App.router=new App.Router,Backbone.history.start()});