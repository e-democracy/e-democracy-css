// Code to power a very simple slide down widget, for sharing a URL, for example
// a post.

fb_widget = '<a class="fb-share" title="Share on Facebook" \
               onclick="javascript:fb_popup(\'http://www.facebook.com/sharer.php?u={HREF}&t={TITLE}\')">&#160;</a>'

twitter_widget = '<a class="twitter-share" title="Share on Twitter" \
               onclick="javascript:fb_popup(\'http://www.twitter.com/home?status={TITLE}:+{HREF}\')">&#160;</a>'

digg_widget = '<a class="digg-share" title="Share on Digg" \
               onclick="javascript:fb_popup(\'http://digg.com/submit?url={HREF}&title={TITLE}\')">&#160;</a>'

email_widget = '<span class="email-share" title="Emailable link">&#160;</span> \
               </span> \
               <div class="full-share"> \
                 <p class="full-share-box-help">Link to this by copy/pasting the URL below into an email:</p> \
                 <input class="full-share-input" type="text" value="{HREF}" readonly="0"/> \
               </div>';

share_widget = '<span class="share-widgets"> \
                 <strong>Share:</strong> \
                 {WIDGETS}'

publicWidgets = [fb_widget, twitter_widget, digg_widget];
generalWidgets = [email_widget];

jQuery.noConflict();

jQuery(document).ready(function(){
    jQuery('.share-bar').each(function(){
        var localwidget = share_widget;
        var href = jQuery(this).attr('href');
        var title = jQuery(this).attr('title');
        var isPublic = Boolean(Number(jQuery(this).attr('public')));
        var allowablewidgets = '';
		
        if (isPublic) {
            for (pos in publicWidgets) {
                allowablewidgets = allowablewidgets + publicWidgets[pos];
            }
        }
        
        for (pos in generalWidgets) {
            allowablewidgets = allowablewidgets + generalWidgets[pos];
        }
        
        title = title.replace(/ /g, '+')
        localwidget = localwidget.replace(/{WIDGETS}/g, allowablewidgets);
        localwidget = localwidget.replace(/{HREF}/g, href);
        localwidget = localwidget.replace(/{TITLE}/g, title);
        jQuery(this).html(localwidget);
    });
    jQuery('.email-share').each(function(){
        jQuery(this).click(function(){
            fullLink = jQuery(this).parents('.share-bar').find('.full-share');
            if (fullLink.is(":hidden")) {
                fullLink.slideDown("slow");
            }
            else {
                fullLink.slideUp("slow");
            }
        });
    });
});

function fb_popup(url){
    newwindow = window.open(url, 'name', 'height=400,width=650');
    if (window.focus) {
        newwindow.focus()
    }
    return false;
}
