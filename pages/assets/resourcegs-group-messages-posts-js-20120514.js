// GroupServer module for providing the Posts tab in a group.
jQuery.noConflict();
var GSGroupPostsTab = function () {
    // Private variables
    // Widgets
    var toolbar = null;
    var prevButton = null;
    var nextButton = null;
    var latestPosts = null;
    var loadingMessage = null;
    // Search Info
    var ajaxPage = 'gs-group-messages-posts-ajax.html';
    var offset = null;
    var limit = null;
    var toolbarShown = true;
    // Constants
    var MAX_ITEMS = 48;
    var FADE_SPEED = 'slow';
    var FADE_METHOD = 'swing';

    // Private methods
    
    // Next button
    var init_next_button = function() {
        nextButton = jQuery('#gs-group-messages-posts-toolbar-next');
        nextButton.button({
            text: true,
            icons: { secondary: 'ui-icon-carat-1-e', },
            disabled: true,
        });
        nextButton.click(handle_next);
    };// init_next_button
    var handle_next = function(eventObject) {
        offset = offset + limit;
        latestPosts.fadeOut(FADE_SPEED, FADE_METHOD, do_posts_load);
    };//handle_next
    
    // Previous Button
    var init_prev_button = function() {
        prevButton = jQuery('#gs-group-messages-posts-toolbar-prev');
        prevButton.button({
            text: true,
            icons: { primary: 'ui-icon-carat-1-w', },
            disabled: true,
        });
        prevButton.click(handle_prev);
    };// init_prev_button
    var handle_prev = function(eventObject) {
        offset = offset - limit;
        if (offset < 0) {
            offset = 0
        }
        latestPosts.fadeOut(FADE_SPEED, FADE_METHOD, do_posts_load);
    };//handle_prev
    
    // Code to load the posts in a pleasing way.
    var do_posts_load = function () {
        // Function used by the buttons.
        loadingMessage.fadeIn(FADE_SPEED, FADE_METHOD, load_posts);
    };//do_posts_load
    var load_posts = function() {
        // Actually load the posts, making am AJAX request
        var data = {
            'i': offset,
            'l': limit,
        };
        jQuery.post(ajaxPage, data, load_complete);
    };// load_posts
    var load_complete = function(responseText, textStatus, request) {
        // Set the contents of the Posts list to the respose.
        latestPosts.html(responseText);
        // Hide the Loading message and show the posts
        loadingMessage.fadeOut(FADE_SPEED, FADE_METHOD, show_posts);
    };// load_complete
    var show_posts = function () {
        // Show the posts list, and enable the buttons as required.
        var nPosts = null;
        latestPosts.fadeIn(FADE_SPEED, FADE_METHOD);
        prevButton.button('option', 'disabled', offset <= 0);
        
        nPosts = latestPosts.find('.post').length;
        nextButton.button('option', 'disabled', nPosts < limit);
        
        if ((offset <= 0) && (nPosts < limit) && toolbarShown) {
            toolbar.fadeOut('fast', FADE_METHOD);
            toolbarShown = false;
        } else if (((offset > 0) || (nPosts >= limit)) && !toolbarShown) {
            toolbar.fadeIn('fast', FADE_METHOD);
            toolbarShown = true;
        }
    };//show_posts

    // Public methods and properties.
    return {
        init: function () {
            limit = 12;
            offset = 0;
        
            init_prev_button();
            init_next_button();
            
            latestPosts = jQuery('#gs-group-messages-posts-latest');
            loadingMessage = jQuery('#gs-group-messages-posts-loading');
            toolbar = jQuery('#gs-group-messages-posts-toolbar');
            
            load_posts();
        },//init
    };
}(); // GSGroupPostsTab
jQuery(document).ready( function () {
    GSGroupPostsTab.init()
});

