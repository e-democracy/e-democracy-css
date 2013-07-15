function gs_is_function(b){var a=null;a=(b&&(typeof(b)==="function"));return a}function GSSequentialJSLoader(a){var e=a,b=null,c=null;
function d(){var f=null;if(c.length>0){f=c.pop();e.with_module(f,d)}else{if((c.length==0)&&gs_is_function(b)){b.call()
}}}return{load_modules:function(f,g){c=f;c.reverse();b=g;d()}}}function GSJSLoader(){var d={},g={};
function e(l,k,m){return function(n){d[l]=k;delete g[l];if(gs_is_function(m)){m.call()
}}}function a(k,m){var l=null;l=document.createElement("script");l.type="text/javascript";
l.src=k;l.async=true;l.onload=e(k,l,m);return l}function c(k){var l=null;l=document.getElementsByTagName("head")[0];
l.appendChild(k)}function b(l){var k=null;k=(typeof d[l]!=="undefined");return k}function f(l){var k=null;
k=(typeof g[l]!=="undefined");return k}function h(l){var k=null;k=(b(l)||f(l));return k
}function i(l,m){var k=null;if(gs_is_function(m)){k=g[l];if(k.addEventListener){k.addEventListener("load",m,false)
}else{window.attachEvent("onload",m)}}}function j(l,m){var k=null;if(b(l)){m.call()
}else{if(f(l)){i(l,m)}else{k=a(l,m);c(k);g[l]=k}}}return{loaded:function(k){return b(k)
},loading:function(k){return f(k)},exists:function(k){return h(k)},with_module:function(l,n){var k=null;
if(typeof l==="string"){j(l,n)}else{k=new GSSequentialJSLoader(this);k.load_modules(l,n)
}}}}var gsJsLoader=GSJSLoader();