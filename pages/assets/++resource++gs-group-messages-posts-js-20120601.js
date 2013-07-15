jQuery.noConflict();

function init_posts () {
    var postsSearch = null;
    var show_posts = null;
    postsSearch = GSSearch('#gs-group-messages-posts-search', 
                           'gs-group-messages-posts-ajax.html', 
                           0, 12, {}, null);
    show_posts = function(event, ui) {
        var panel = jQuery(ui.panel);
        if ((panel.attr('id') ===  'task-tab-1') && 
            (!postsSearch.results_shown())) {
            postsSearch.load();
        }
    };
    jQuery('#task-tabs').bind('tabsshow', show_posts);
}

jQuery(window).load( function () {
    gsJsLoader.with_module('/++resource++gs-search-base-js-min-20121217.js',
                           init_posts);
});
