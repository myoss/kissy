/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Mar 13 18:02
*/
KISSY.add("scroll-view/touch",["./base","node","anim"],function(t,u){function w(a,d,b){if(!x(a,b)){var c=a.startScroll[b]-("left"===b?d.deltaX:d.deltaY),d=a.minScroll,f=a.maxScroll;a._bounce||(c=Math.min(Math.max(c,d[b]),f[b]));c<d[b]?(c=d[b]-c,c*=y,c=d[b]-c):c>f[b]&&(c-=f[b],c*=y,c=f[b]+c);a.set("scroll"+t.ucfirst(b),c)}}function x(a,d){return!a.allowScroll[d]&&a["_"+("left"===d?"lockX":"lockY")]?1:0}function z(a,d,b,c){if(x(a,b))c();else{var f="scroll"+t.ucfirst(b),e=a.get(f),i=a.minScroll,k=a.maxScroll,
j;e<i[b]?j=i[b]:e>k[b]&&(j=k[b]);void 0!==j?(e={},e[b]=j,a.scrollTo(e,{duration:a.get("bounceDuration"),easing:a.get("bounceEasing"),queue:!1,complete:c})):a.pagesOffset?c():(j="left"===b?-d.velocityX:-d.velocityY,j=Math.min(Math.max(j,-A),A),c={node:{},to:{},duration:9999,queue:!1,complete:c,frame:C(a,j,e,f,k[b],i[b])},c.node[b]=e,c.to[b]=null,a.scrollAnims.push((new D(c)).run()))}}function C(a,d,b,c,f,e){var i=d*v,k=1,j=0;return function(d,s){var g=t.now(),h;if(k){h=g-d.startTime;var l=Math.exp(h*
E);h=parseInt(b+i*(1-l)/-B,10);h>e&&h<f?s.lastValue===h?s.pos=1:(s.lastValue=h,a.set(c,h)):(k=0,i*=l,b=h<=e?e:f,j=g)}else h=g-j,g=h/v,g*=Math.exp(-F*g),h=parseInt(i*g,10),0===h&&(s.pos=1),a.set(c,b+h)}}function G(a){"touch"!==a.gestureType||this.isScrolling&&this.pagesOffset||(this.startScroll={},this.dragInitDirection=null,this.isScrolling=1,this.startScroll.left=this.get("scrollLeft"),this.startScroll.top=this.get("scrollTop"))}function H(a){"touch"===a.gestureType&&this.isScrolling&&this.fire("touchEnd",
{pageX:a.pageX,deltaX:a.deltaX,deltaY:a.deltaY,pageY:a.pageY,velocityX:a.velocityX,velocityY:a.velocityY})}function I(a){function d(){c++;if(2===c){var d=function(){b.isScrolling=0;b.fire("scrollTouchEnd",{pageX:a.pageX,pageY:a.pageY,deltaX:-f,deltaY:-e,fromPageIndex:h,pageIndex:b.get("pageIndex")})};if(b.pagesOffset){var i=b._snapDurationCfg,g=b._snapEasingCfg,h=b.get("pageIndex"),l=b.get("scrollLeft"),o=b.get("scrollTop"),i={duration:i,easing:g,complete:d},q=b.pagesOffset,n=q.length;b.isScrolling=
0;if(k||j)if(k&&j){var g=[],m,p;for(m=0;m<n;m++){var r=q[m];r&&(0<f&&r.left>l?g.push(r):0>f&&r.left<l&&g.push(r))}q=g.length;if(0<e){l=Number.MAX_VALUE;for(m=0;m<q;m++)n=g[m],n.top>o&&l<n.top-o&&(l=n.top-o,p=g.index)}else{l=Number.MAX_VALUE;for(m=0;m<q;m++)n=g[m],n.top<o&&l<o-n.top&&(l=o-n.top,p=g.index)}void 0!==p?p!==h?b.scrollToPage(p,i):(b.scrollToPage(p),d()):d()}else k||j?(d=b.getPageIndexFromXY(k?l:o,k,k?f:e),b.scrollToPage(d,i)):(b.scrollToPage(h),d())}else d()}}var b=this,c=0,f=-a.deltaX,
e=-a.deltaY,i=b._snapThresholdCfg,k=b.allowScroll.left&&Math.abs(f)>i,j=b.allowScroll.top&&Math.abs(e)>i;z(b,a,"left",d);z(b,a,"top",d)}function J(a){"touch"===a.gestureType&&a.preventDefault();if((!this.isScrolling||!this.pagesOffset)&&this.isScrolling)this.stopAnimation(),this.fire("scrollTouchEnd",{pageX:a.pageX,pageY:a.pageY})}var K=u("./base"),L=u("node"),D=u("anim"),y=0.5,M=L.Gesture,A=6,v=20,B=Math.log(0.95),E=B/v,F=0.3,N=function(a){if("touch"===a.gestureType&&this.isScrolling){var d=Math.abs(a.deltaX),
b=Math.abs(a.deltaY),c=this._lockX,f=this._lockY;if(c||f){var e;if(!(e=this.dragInitDirection))this.dragInitDirection=e=d>b?"left":"top";if(c&&"left"===e&&!this.allowScroll[e]){this.isScrolling=0;this._preventDefaultX&&a.preventDefault();return}if(f&&"top"===e&&!this.allowScroll[e]){this.isScrolling=0;this._preventDefaultY&&a.preventDefault();return}}a.preventDefault();w(this,a,"left");w(this,a,"top")}};return K.extend({initializer:function(){this._preventDefaultY=this.get("preventDefaultY");this._preventDefaultX=
this.get("preventDefaultX");this._lockX=this.get("lockX");this._lockY=this.get("lockY");this._bounce=this.get("bounce");this._snapThresholdCfg=this.get("snapThreshold");this._snapDurationCfg=this.get("snapDuration");this._snapEasingCfg=this.get("snapEasing");this.publish("touchEnd",{defaultFn:I,defaultTargetOnly:!0})},_onSetDisabled:function(a){a=a?"detach":"on";this.$contentEl[a]("gestureDragStart",G,this)[a](M.start,J,this)[a]("gestureDrag",N,this)[a]("gestureDragEnd",H,this)},destructor:function(){this.stopAnimation()},
stopAnimation:function(){this.callSuper();this.isScrolling=0}},{ATTRS:{lockX:{value:!0},preventDefaultX:{value:!0},lockY:{value:!1},preventDefaultY:{value:!1},snapDuration:{value:0.3},snapEasing:{value:"easeOut"},snapThreshold:{value:5},bounce:{value:!0},bounceDuration:{value:0.4},bounceEasing:{value:"easeOut"}}})});