// Developed by Addiply - should be loaded only once per page


document.addiply.jquery = null;


(function( document ) {	// Anonymous function to prevent scope clash

	var loader = document.createElement( 'script' );
	loader.type = 'text/javascript';
	loader.async = true;
	loader.onload = loader.onreadystatechange = function() {

		var rs = this.readyState;
		if( rs && rs != 'complete' && rs != 'loaded' ) {

			return;
		}

		document.addiply.jquery = jQuery.noConflict( true );

	// Set up call for when page has loaded...
		document.addiply.jquery( document ).ready( function() {

			adp_ads_serve( document );
		});
	}

	loader.src = ( ( document.location.protocol == 'https:' ) ? 'https' : 'http' ) + '://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
	var s = document.getElementsByTagName( 'script' )[ 0 ];
	s.parentNode.insertBefore( loader, s );
})( document );



function adp_ads_serve( document ) {

	document.addiply.jquery( "div.adp_space" ).each( function(){
	
		var id = document.addiply.jquery( this ).attr( 'id' );
		if( ! id ) {
		
			return;
		}
		
		var matches = id.match( /^adp_space_(\d+)$/ );
		if( ! matches || matches.length < 2 ) {
		
			return;
		}

		var space_id = matches[ 1 ];
		
	// Query the space and serve...
		document.addiply.jquery.ajax( adp_link_get( 'serve', { id: space_id } ), {

			type: 'GET',
			dataType: 'jsonp',
			cache: false,
			error: function( jqXHR, textStatus, errorThrown ) {

				// Error...
			},
			success: function( data, textStatus, jqXHR ) {

				// Success...
			}
		});
	});
}





// JSONP cb...
function adp_serve_render( data ) {
		
	// Find type of space / adverts needed:
	if( typeof data.inventory == 'undefined' ) {
	
		adp_banner_default_render( data );
	} else if( data.inventory.type.adverttypeid == 1 ) { // Text

		adp_text_render( data );
	} else if( data.inventory.type.adverttypeid == 2 ) {	// Banner...

		adp_banner_render( data );
	}
    
	return true;
}



function adp_text_render( data ) {

	var dom_id = 'adp_space_' + data.inventory.id;

	data = adp_text_object_init( data );

	// Vars
	var noAdverts = 0;
	var width = data.inventory.panel_width;
	var height = data.inventory.panel_height;
	var horizontal = false;
	if( width > height ) {
	
		horizontal = true;
	}

	// Get no of ads.
	if( typeof data.adverts != 'undefined' ) {		// TODO - handle no adverts

		noAdverts = data.adverts.length;
	}
	
	// Calculate width and height of each advert
	var adwidth = (width - ( 10 * data.inventory.cells ) ) / data.inventory.cells;
	var adheight = (height - ( 5 * data.inventory.cells ) ) / data.inventory.cells;
	if( horizontal ) {

		adheight = height;
	} else {

		adwidth = width;
	}

	var adSpace = document.getElementById( dom_id );
	adSpace.style.width = data.inventory.panel_width + "px";
	adSpace.style.height = data.inventory.panel_height + "px";

	// Setup Adverts...
	var output = '';
	for( var i = 0; i < noAdverts; i++ ) {
		output += '<div id="advert'+data.adverts[i].advert.id+'" class="adtxtad">';
		output += '<p class="adtitle"><a class="adlink" href="'+ adp_link_get( 'click', { id: data.adverts[i].campaignid } ) + '" target="_blank">' + data.adverts[i].advert.title + '</a></p>'
		output += '<p class="adcont">'+data.adverts[i].advert.content+'</p>'
		output += '</div>';
	}

	// Setup blank spaces...
	for( var i = data.inventory.cells; i > noAdverts; i-- ) {
		output += '<div class="adtxtad freetxtspace">';
		output += '<p class="adtitle"><a class="adlink" href="' + adp_link_get( 'spot', { id: data.inventory.id } ) + '" target="_blank">' + data.inventory.default_title + '</a></p>'
		output += '<p class="adcont">'+data.inventory.default_message+'</p>'
		output += '</div>';
	}

	document.addiply.jquery( '#' + dom_id ).html(output);
	document.addiply.jquery( '.adtxtad' ).css('background-color', '#'+data.inventory.background_color);
	document.addiply.jquery( '.adtxtad' ).width(adwidth).height(adheight);
	document.addiply.jquery( '.adtxtad' ).css('padding', '0px 5px 5px 5px').css('margin', '0');
	document.addiply.jquery( '.adtxtad > p' ).css('padding', '0').css('margin', '0');
	document.addiply.jquery( '.adlink' ).css('color', '#'+data.inventory.title_color);
	document.addiply.jquery( '.adcont' ).css('color', '#'+data.inventory.text_color);

	if( horizontal ) {

		document.addiply.jquery('.adtxtad').css('float', 'left');
	}
}



function adp_banner_render( data ) {

	if( typeof data.adverts == 'undefined' ) {

		adp_banner_default_render( data );
		return;
	}
	
	var noAdverts = 0;

// Only one ad for image type...
	var ad_data = data.adverts[0];

	var format = 'jpg';
	switch( ad_data.advert.mimetype ) {

		case 'image/gif':
			format = 'gif';
		break;

		case 'image/png':
			format = 'png';
		break;
	}

	adp_image_render({
	
		id: data.inventory.id,
		click_url: adp_link_get( 'click', { id: ad_data.campaignid } ),
		img_src: adp_link_get( 'render', { id: ad_data.advert.id, format: format } ),
		title: ad_data.advert.title,
		w: ad_data.advert.size.width,
		h: ad_data.advert.size.height
	});
}



function adp_banner_default_render( data ) {

	var img_src = data.defaultbanner ?
		adp_link_get( 'default_banner_custom', { route: data.defaultbanner } ) :
		adp_link_get( 'default_banner_adp', { w: data.inventory.size.width, h: data.inventory.size.height } );

	adp_image_render({
	
		id: data.inventory.id,
		click_url: adp_link_get( 'spot', { id: data.inventory.id } ),
		img_src: img_src,
		title: 'Advertise here!',
		w: data.inventory.size.width,
		h: data.inventory.size.height
	});
}



function adp_image_render( params ) {

	var output = '<a href="' + params.click_url + '" target="_blank">';
	output += '<img src="' + params.img_src + '" alt="' + params.title + '" style="width: ' + params.w + 'px; height: ' + params.h + 'px" />';
	output += '</a>';

	document.addiply.jquery( '#adp_space_' + params.id ).html( output );
}



function adp_text_object_init( data ) {

	//Init defaults if blank
	if( ! data.inventory.default_title ) {
		data.inventory.default_title = 'Advertise with Addiply';
	}
	
	if( ! data.inventory.default_message ) {
		data.inventory.default_message = 'Get your advert here today';
	}
	
	if( ! data.inventory.title_color ) {
		data.inventory.title_color = 'CA1313';
	}
	
	if( ! data.inventory.background_color ) {
		data.inventory.background_color = 'FFFFFF';
	}
	
	if( ! data.inventory.text_color ) {
		data.inventory.text_color = '000000';
	}
	
	return data;
}



function adp_link_get( type, params ) {

	var api_url = 'https://betaapi.addiply.com';
	var adp_url = 'https://beta.addiply.com/ad';
	switch( type ) {
	
		case 'serve':
		return adp_url + '/serve/' + params.id;

		case 'render':
		return adp_url + '/render/' + params.id + '.' + params.format;

		case 'click':
		return adp_url + '/click/' + params.id;

		case 'default_banner_adp':
		return 'http://cdn.addiply.com/banner_default_' + params.w + 'x' + params.h + '.jpg';

		case 'default_banner_custom':
		return api_url + params.route;

		case 'spot':
		return 'https://beta.addiply.com/network/inventory/' + params.id;
	}
	
	return false;
}
