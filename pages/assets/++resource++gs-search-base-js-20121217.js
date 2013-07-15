// GroupServer JavaScript module for providing the Search mechanism
jQuery.noConflict();
function GSSearch(widgetId, ajaxPage, offset, limit, additionalQuery, 
                  advancedSearch) {
    // Private variables
    // Widgets
    var widget = null, searchInput = null, searchButton = null, 
        loadingMessage = null, results = null, toolbar = null, 
        prevButton = null, nextButton = null, ajaxPageUrl = '', searchText = '',
        toolbarShown = true, searchShown = true, resultsShown = false,
        FADE_SPEED = 'slow', FADE_METHOD = 'swing', 
        RESULTS_LOADED_EVENT = "resultsloaded";

    // Private methods
    function disable(b) {
        b.attr('disabled', 'disabled');
        b.attr('aria-disabled', 'true');
    }
    function enable(b) {
        b.removeAttr('disabled');
        b.attr('aria-disabled', 'false');
    }  

    // Previous Button
    function init_prev_button() {
        prevButton.on('click', handle_prev);
    }// init_prev_button
    function handle_prev(eventObject) {
        offset = offset - limit;
        if (offset < 0) {
            offset = 0
        }
        hide_and_load_results()
    }//handle_prev
    
    // Next button
    function init_next_button() {
        nextButton.on('click', handle_next);
    }// init_next_button
    function handle_next(eventObject) {
        var nSticky = null;
        if (searchInput.val()) {
            offset = offset + limit;
        } else {
            nSticky = results.find('.gs-search-sticky').length;
            offset = offset + limit - nSticky;
        }
        hide_and_load_results()
    }//handle_next
    
    // Search Input
    function init_search_input() {
        searchInput.keypress(handle_search_input);
    }// init_search_input
    function handle_search_input(eventObject) {
        if (eventObject.which == 13) {
            searchButton.click();
        }
    };// handle_search_input

    // Search Button
    function init_search_button() {
        searchButton.on('click', handle_search);
    };//init_search_button
    function handle_search(eventObject) {
        disable(searchInput);
        disable(searchButton);
        disable(prevButton);        
        disable(nextButton);

        searchText = searchInput.val();
        offset = 0;
        results.fadeOut(FADE_SPEED, FADE_METHOD, do_results_load);
        results.attr('aria-hidden', 'true');
    };//handle_search


    function hide_and_load_results() {
        var oldHeight = 0;
        oldHeight = results.height();
        
        loadingMessage.height(oldHeight + 'px');
        results.fadeOut(FADE_SPEED, FADE_METHOD, do_results_load);
        results.attr('aria-hidden', 'true');
    }

    // Code to load the results in a pleasing way.
    function do_results_load() {
        // Function used by the buttons.
        loadingMessage.fadeIn(FADE_SPEED, FADE_METHOD, load_results);
        loadingMessage.attr('aria-hidden', 'false');
    };//do_results_load
    function load_results() {
        // Actually load the results, making am AJAX request
        var data = null, href = null, query = null, newHref = null;
        
        if (advancedSearch) {
            href = advancedSearch.attr('href');
            query = '&i='+offset+'&s='+searchText.replace(/ /, '+');
            newHref = href.replace(/&i.*$/, query);
            advancedSearch.attr('href', newHref);
        }
        if (additionalQuery === {}) {// Three = is deliberate
            data = {};
        } else {        
            data = additionalQuery;
        };
        data['i'] = offset;
        data['l'] = limit;
        data['s'] = searchText;
        jQuery.post(ajaxPageUrl, data, load_complete);
    };// load_results
    function load_complete(responseText, textStatus, request) {
        // Set the contents of the results-list to the respose.
        results.html(responseText);
        // Hide the Loading message and show the results.
        loadingMessage.fadeOut(FADE_SPEED, FADE_METHOD, show_results);
        loadingMessage.attr('aria-hidden', 'true');
    };// load_complete
    function show_results() {
        // Show the results list, and enable the buttons as required.
        var nResults = null;
        results.fadeIn(FADE_SPEED, FADE_METHOD);
        results.attr('aria-hidden', 'false');
        loadingMessage.height('auto');
        
        enable(searchInput);
        enable(searchButton);
        if (offset <= 0) {
            disable(prevButton);
        } else {
            enable(prevButton);
        }
        nResults = results.find('.gs-search-result').length;
        if (nResults < limit) {
            disable(nextButton);
        } else {
            enable(nextButton);
        }

        init_keywords();
        
        if ((offset <= 0) && (nResults < limit) && toolbarShown) {
            toolbar.fadeOut('fast', FADE_METHOD);
            toolbarShown = false;
        } else if (((offset > 0) || (nResults >= limit)) && !toolbarShown) {
            toolbar.fadeIn('fast', FADE_METHOD);
            toolbarShown = true;
        }
    
        if ((nResults == 0) && searchShown) {
            searchInput.fadeOut('fast', FADE_METHOD);
            searchButton.fadeOut('fast', FADE_METHOD);
            searchShown = false;
        } else if ((nResults > 0) && !searchShown) {
            searchInput.fadeIn('fast', FADE_METHOD);
            searchButton.fadeIn('fast', FADE_METHOD);
            searchShown = true;
        }

        propogate_results_loaded_event()
        resultsShown = true;
    };//show_results

    function propogate_results_loaded_event() {
        var event = jQuery.Event(RESULTS_LOADED_EVENT);
        widget.trigger(event);
    };

    // Keywords
    function init_keywords() {
        keywords = null;
        keywords = results.find('.gs-search-keyword');
        if (keywords.length > 0) {
            keywords.removeAttr('href').css("cursor","pointer");
            keywords.click(handle_keyword_click);
        }
    };//init_keywords
    function handle_keyword_click(eventObject) {
        var searchText = jQuery(this).text();
        searchInput.val(searchText);
        searchButton.click();
    };//handle_keyword_click

    //
    // The Initializer
    // This is the closest we'll get to a classical constructor.
    //
    function init() {
        widget = jQuery(widgetId);
    
        searchInput = widget.find('.gs-search-entry input');
        init_search_input();
        searchButton = widget.find('.gs-search-entry button');
        init_search_button();
        
        loadingMessage = widget.find('.gs-search-loading');
        results = widget.find('.gs-search-results');
        
        toolbar = widget.find('.gs-search-toolbar');
        prevButton = widget.find('.gs-search-toolbar-previous');
        init_prev_button();
        nextButton = widget.find('.gs-search-toolbar-next');
        init_next_button();

        ajaxPageUrl = ajaxPage;
    }
    init(); //Run this function on startup

    // Return the public methods and properties.
    return {
        load: function () {
            searchButton.click();
        }, // load
        results_shown: function () {
            return resultsShown;
        },// results_shown
        'RESULTS_LOADED_EVENT': RESULTS_LOADED_EVENT
    };// Public methods
};//GSSearch
