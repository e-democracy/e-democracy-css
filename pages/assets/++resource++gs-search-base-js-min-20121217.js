jQuery.noConflict();function GSSearch(d,O,E,r,M,n){var z=null,e=null,y=null,o=null,p=null,l=null,J=null,q=null,s="",G="",L=true,w=true,v=false,A="slow",f="swing",h="resultsloaded";
function c(P){P.attr("disabled","disabled");P.attr("aria-disabled","true")}function g(P){P.removeAttr("disabled");
P.attr("aria-disabled","false")}function C(){J.on("click",i)}function i(P){E=E-r;
if(E<0){E=0}B()}function b(){q.on("click",D)}function D(P){var Q=null;if(e.val()){E=E+r
}else{Q=p.find(".gs-search-sticky").length;E=E+r-Q}B()}function F(){e.keypress(u)
}function u(P){if(P.which==13){y.click()}}function H(){y.on("click",a)}function a(P){c(e);
c(y);c(J);c(q);G=e.val();E=0;p.fadeOut(A,f,I);p.attr("aria-hidden","true")}function B(){var P=0;
P=p.height();o.height(P+"px");p.fadeOut(A,f,I);p.attr("aria-hidden","true")}function I(){o.fadeIn(A,f,j);
o.attr("aria-hidden","false")}function j(){var S=null,Q=null,R=null,P=null;if(n){Q=n.attr("href");
R="&i="+E+"&s="+G.replace(/ /,"+");P=Q.replace(/&i.*$/,R);n.attr("href",P)}if(M==={}){S={}
}else{S=M}S.i=E;S.l=r;S.s=G;jQuery.post(s,S,t)}function t(Q,R,P){p.html(Q);o.fadeOut(A,f,N);
o.attr("aria-hidden","true")}function N(){var P=null;p.fadeIn(A,f);p.attr("aria-hidden","false");
o.height("auto");g(e);g(y);if(E<=0){c(J)}else{g(J)}P=p.find(".gs-search-result").length;
if(P<r){c(q)}else{g(q)}k();if((E<=0)&&(P<r)&&L){l.fadeOut("fast",f);L=false}else{if(((E>0)||(P>=r))&&!L){l.fadeIn("fast",f);
L=true}}if((P==0)&&w){e.fadeOut("fast",f);y.fadeOut("fast",f);w=false}else{if((P>0)&&!w){e.fadeIn("fast",f);
y.fadeIn("fast",f);w=true}}x();v=true}function x(){var P=jQuery.Event(h);z.trigger(P)
}function k(){keywords=null;keywords=p.find(".gs-search-keyword");if(keywords.length>0){keywords.removeAttr("href").css("cursor","pointer");
keywords.click(m)}}function m(P){var Q=jQuery(this).text();e.val(Q);y.click()}function K(){z=jQuery(d);
e=z.find(".gs-search-entry input");F();y=z.find(".gs-search-entry button");H();o=z.find(".gs-search-loading");
p=z.find(".gs-search-results");l=z.find(".gs-search-toolbar");J=z.find(".gs-search-toolbar-previous");
C();q=z.find(".gs-search-toolbar-next");b();s=O}K();return{load:function(){y.click()
},results_shown:function(){return v},RESULTS_LOADED_EVENT:h}};