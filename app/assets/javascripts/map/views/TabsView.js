/**
 * The TabsView view.
 *
 * @return TabsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'd3',
  'map/presenters/TabsPresenter',
  'map/views/tabs/AnalysisView',
  'map/views/tabs/CountriesView',
  'map/views/tabs/BasemapsView',
  'map/views/tabs/SpinnerView',
  'map/views/tabs/SubscribeView',
  'text!map/templates/tabs.handlebars',
  'text!map/templates/tabs-mobile.handlebars'

], function(_, Handlebars, d3, Presenter, AnalysisView, CountriesView, BasemapsView, SpinnerView, SubscribeView, tpl, tplMobile) {

  'use strict';

  var TabsView = Backbone.View.extend({

    el: '#module-tabs',

    events: {
      'click .tab' : 'toggleTabs',
      'click .share-mobile' : 'toggleShareMobile',
      'click .tab-mobile' : 'toggleTabsMobile',
      'click .close-tab-mobile' : 'hideTabsMobile'
    },

    template: Handlebars.compile(tpl),
    templateMobile: Handlebars.compile(tplMobile),

    initialize: function(map) {
      this.map = map;
      this.presenter = new Presenter(this);
      // Render
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render();
          this.cacheVars();
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.renderMobile();
          this.cacheVars();
        },this)
      });
      // this.setListeners();
    },

    cacheVars: function(){
      this.$tabs = this.$el.find('.tab');
      this.$tabMobileButtons = $('.tab-mobile');
      this.$tabsMobileContent = this.$el.find('.tab-mobile-content');
      this.$tabsContent = this.$el.find('.tab-content');
      this.$container = this.$el.find('.content');
    },

    // setListeners: function(){

    // },

    render: function(){
      this.$el.html(this.template());
      this.$el.removeClass('hide');
      this.initCustomViews();
    },

    renderMobile: function(){
      this.$el.html(this.templateMobile());
      this.$el.removeClass('hide');
      this.initCustomMobileViews();
    },

    initCustomViews: function(){
      new SpinnerView();
      new AnalysisView(this.map);
      new CountriesView(this.map);
      new BasemapsView();
      new SubscribeView();
    },

    initCustomMobileViews: function(){
      new AnalysisView(this.map);
      new CountriesView(this.map);
      new BasemapsView();
    },

    toggleTabs: function(e){
      if ($(e.currentTarget).hasClass('active')) {
        // Close all tabs and reset tabs styles
        this.$container.removeClass('active')
        this.$tabs.removeClass('inactive active');
        this.$tabsContent.removeClass('selected');
      }else{
        if (!$(e.currentTarget).hasClass('disabled')) {
          // Open current tab
          var id = $(e.currentTarget).data('tab');
          this.$container.addClass('active');

          // tabs
          this.$tabs.removeClass('active').addClass('inactive');
          $(e.currentTarget).removeClass('inactive').addClass('active');

          // tabs content
          this.$tabsContent.removeClass('selected');
          $('#'+ id).addClass('selected');

          //publish open tab
          this.presenter.onTabOpen(id);
        }
      }
    },

    toggleShareMobile: function(){
      this.presenter.toggleShare();
    },

    toggleTabsMobile: function(e){
      var $tab = $('#'+$(e.currentTarget).data('tab'));
      if ($tab.hasClass('active')) {
        this.$tabMobileButtons.removeClass('active');
        this.$tabsMobileContent.removeClass('active');
      }else{
        this.$tabMobileButtons.removeClass('active');
        $(e.currentTarget).addClass('active');
        this.$tabsMobileContent.removeClass('active');
        $tab.addClass('active');
      }
    },

    hideTabsMobile: function(){
      this.$tabMobileButtons.removeClass('active');
      this.$tabsMobileContent.removeClass('active');
    },

    openTab: function(id){
      if (!$(id).hasClass('active')) {
        $(id).trigger('click');
      }
    }
  });

  return TabsView;

});
