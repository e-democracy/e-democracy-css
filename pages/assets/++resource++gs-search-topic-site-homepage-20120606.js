jQuery.noConflict() 
var GSSearchTopicsSiteHomepage = function () {
    var go_one_col = function () {
        var left = null;

        left = jQuery('#gs-site-home-left');
        left.removeAttr('class');
    };
    var handle_load = function(event) {
        var results = null;
        var nResults = null;
        var right = null;

        results = jQuery(event.target);
        nResults = results.find('.gs-search-result').length;
        if (nResults === 0) {
            right = jQuery('#gs-site-home-right');
            right.fadeOut('slow', 'swing', go_one_col);
        }
    };
    
    return {
        init: function() {
            var searchId = '#gs-search-topic-site-home-search'
            var topicSearch = GSSearch(searchId, '/s/search.ajax', 0, 6, {}, 
                                       null);
            topicSearch.load();
            jQuery(searchId).bind(topicSearch.RESULTS_LOADED_EVENT,
                                  handle_load);
        }//init
    }
}();
jQuery(document).ready( function () {
    GSSearchTopicsSiteHomepage.init()
});