var GSDisclosureButton=function(){var e="\u25b6",b="\u25bc",d="fast",a=".disclosureWidget",k=".disclosureButton",c=".disclosureShowHide";
function i(m){var l=jQuery(m).parents(a).find(c);return l}function h(){var m=jQuery(this),l=m.html(),q=l.substring(2,l.length),o=l.substring(0,1),p=i(this),n=null;
if(o==e){m.html(b+" "+q);n="false"}else{m.html(e+" "+q);n="true"}p.slideToggle(d).attr("aria-hidden",n)
}function j(l){var n=jQuery(this),m=n.html(),p=m.substring(2,m.length),o=i(this);
n.html(b+" "+p);o.slideDown(d).attr("aria-hidden","true")}function f(l){var n=jQuery(this),m=n.html(),p=m.substring(2,m.length),o=i(this);
n.html(e+" "+p);o.slideUp(d).attr("aria-hidden","false")}function g(l){var o=null,n=false,m=null;
o=i(this);n=o.css("display")!="none";m=jQuery(this);if(n){m.prepend(b+" ");o.attr("aria-hidden","false")
}else{m.prepend(e+" ");o.attr("aria-hidden","true")}m.removeAttr("href").css("cursor","pointer").click(h)
}return{init:function(){jQuery(k).each(g)},toggle_all:function(){jQuery(k).click()
},show_all:function(){jQuery(k).each(j)},hide_all:function(){jQuery(k).each(f)}}}();
jQuery(window).load(GSDisclosureButton.init);