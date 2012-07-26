       	jQuery.noConflict()
        jQuery.fn.dataTableExt.oSort["string-nocase-empty-last-asc"] = function(x,y) {
            x = x.toLowerCase();
            y = y.toLowerCase();
            return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
        };
        jQuery.fn.dataTableExt.oSort["string-nocase-empty-last-desc"] = function(x,y) {
            x = x.toLowerCase();
            y = y.toLowerCase();
            return ((y == '') ? -1 : (x < y) ? -1 : ((x > y) ?  1 : 0));
        };
       	jQuery(document).ready(function() {
       	jQuery('#memberdirectory').dataTable( {
               	"oLanguage": {"sSearch": "Filter records:"},
               	"aaSorting": [[0,'asc']],
               	"bProcessing": true,
               	"iDisplayLength": 100,
               	"sAjaxSource": 'members.json',
               	"sPaginationType": "full_numbers",
               	"aoColumns": [{"sTitle": "Name",
                               "sType": "html",
                               "sWidth": "25%"},
                              {"sTitle": "Organisation",
                               "sWidth": "10%",
                               "sType":  "string-nocase-empty-last"},
                              {"sTitle": "City",
                               "sWidth": "10%",
                               "sType":  "string-nocase-empty-last"},
                              {"sTitle": "Region",
                               "sWidth": "10%",
                               "sType":  "string-nocase-empty-last"},
                              {"sTitle": "Country",
                               "sType":  "string-nocase-empty-last"},
                              {"sTitle": "Joined",
                               "sWidth": "5%"}]
       	} );
} );

