/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Mar 13 18:01
*/
KISSY.add("navigation-view",["component/container","component/control","component/extension/content-xtpl","component/extension/content-render"],function(j,g){function l(a,c,b){return a+"navigation-view-"+("anim-"+c+"-"+(b?"enter":"leave"))+" "+a+"navigation-view-anim-ing"}function m(a,c,b){a=a.get("animation");return"string"===typeof a?a:b?c?a[1]:a[0]:c?a[0]:a[1]}function h(a,c,b){i(a);b=m(a,c,b);"none"===b?c?a.show():a.hide():(a.show(),a.$el.addClass(a._viewAnimCss=l(a.get("prefixCls"),b,c)))}function i(a){a._viewAnimCss&&
(a.$el.removeClass(a._viewAnimCss),a._viewAnimCss=null)}function n(a,c,b){var e=a.loadingView,d=a.get("activeView");a.fire("beforeInnerViewChange",{oldView:d,newView:c,backward:b});d&&d.leave&&d.leave();a.set("activeView",c);c.enter&&c.enter();var f=c.promise;f?(d?(h(d,!1,b),e.transition(!0,b)):e.show(),f.then(function(){if(a.get("activeView")===c){e.hide();c.show();a.fire("afterInnerViewChange",{newView:c,oldView:d,backward:b})}})):(e.get("visible")?(e.transition(!1,b),h(c,!0,b)):d?(h(d,!1,b),h(c,
!0,b)):c.show(),a.fire("afterInnerViewChange",{newView:c,oldView:d,backward:b}));q(a)}function q(a){var c=a.get("children").concat(),b=a.get("viewCacheSize");if(!(c.length<=b)){b=Math.floor(b/3);c.sort(function(a,b){return a.timeStamp-b.timeStamp});for(var e=0;e<b;e++)a.removeChild(c[e])}}function r(){i(this);this.get("navigationView").get("activeView")===this?this.show():this.hide()}function o(a,c){var b;a:{b=a.get("children");for(var e=c.viewId,d=0;d<b.length;d++)if(b[d].constructor.xclass===c.xclass)if(e){if(b[d].get("viewId")===
e){b=b[d];break a}}else{b=b[d];break a}b=null}b?b.set(c):(b=a.addChild(c),b.$el.on(p,r,b));b.timeStamp=j.now();return b}var f=j.Feature.getVendorCssPropPrefix("animation"),p=f?f.toLowerCase()+"AnimationEnd":"animationend webkitAnimationEnd",f=g("component/container"),k=g("component/control"),s=g("component/extension/content-xtpl"),t=g("component/extension/content-render"),u=k.extend({bindUI:function(){var a=this;a.$el.on(p,function(){i(a);a.active||a.hide()})},transition:function(a,c){this.active=
a;var b=this.navigationView.get("activeView");i(this);var e=m(b,a,c);"none"===e?a?this.show():this.hide():(this.show(),this.$el.addClass(this._viewAnimCss=l(b.get("prefixCls"),e,a)))}},{xclass:"navigation-view-loading",ATTRS:{handleGestureEvents:{value:!1},visible:{value:!1}}}),k=f.getDefaultRender().extend([t]);return f.extend({initializer:function(){this.viewStack=[]},createDom:function(){var a=this.get("loadingHtml");!1!==a&&(this.loadingView=(new u({content:a,render:this.contentEl})).render(),
this.loadingView.navigationView=this)},_onSetLoadingHtml:function(a){this.loadingView&&this.loadingView.set("content",a)},push:function(a){var c,b=this.viewStack;a.animation=a.animation||this.get("animation");a.navigationView=this;c=o(this,a);b.push(a);n(this,c)},replace:function(a){var c=this.viewStack;j.mix(c[c.length-1],a);this.get("activeView").set(a)},pop:function(a){a=this.viewStack;1<a.length&&(a.pop(),a=a[a.length-1],a=o(this,a),n(this,a,!0))}},{xclass:"navigation-view",ATTRS:{animation:{value:["slide-right",
"slide-left"]},loadingHtml:{sync:0},handleGestureEvents:{value:!1},viewCacheSize:{value:10},focusable:{value:!1},allowTextSelection:{value:!0},xrender:{value:k},contentTpl:{value:s},defaultChildCfg:{value:{handleGestureEvents:!1,visible:!1,allowTextSelection:!0}}}})});