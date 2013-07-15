jQuery.noConflict();function gs_group_messages_posts_init_search(){var c=null;function b(d,e){if(!c.results_shown()){c.load()
}}function a(){var d=null;d=jQuery("base").attr("href");if(d[d.length-1]!="/"){d=d+"/"
}return d+"gs-group-messages-posts-ajax.html"}c=GSSearch("#gs-group-messages-posts-search",a(),0,12,{},null);
jQuery("#gs-group-messages-base-tab-1 a").click(b)}jQuery(window).load(function(){gsJsLoader.with_module("/++resource++gs-search-base-js-min-20121217.js",gs_group_messages_posts_init_search)
});