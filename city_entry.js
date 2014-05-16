/* $Id: city_entry.js,v 1.2 2014/05/06 20:29:39 caran Exp $ */

function init_state_city( $city_entry, state, city )
 {
  if ($city_entry === null || !state) {
    return false;
  }

  $city_entry.children( 'select.state_list' ).val( state ).change().trigger( 'chosen:updated' );
  if (state === 'MA' || state === 'NH') {
    $city_entry.children( 'select.city_list' ).val( city ).trigger( 'chosen:updated' );
  }
  else {
    $city_entry.children( 'input.city_input' ).val( city );
  }
 }

function is_ma_nh( element )
 {
  var value = $( element ).siblings( 'select.state_list' ).val();
  return (value === 'MA' || value === 'NH');
 }

function load_cities( cityentryObj, list )
 {
  var $citylist = $( cityentryObj ).children( '.city_list' );

  var option_html = [ '<option value="">Chose a city</option>' ];
  var disabled = false;
  for (var i = 0; i < list.length; i++) {
    option_html.push( '<option>', list[i], '</option>' );
   }
  if (!option_html.length) {
    option_html.push( '<option>Non MA/NH Location</option>' );
    var disabled = true;
   }

  $citylist.html( option_html.join( '' ) ).prop( 'disabled', disabled );
 }

$(document).ready( function() {
  $( '.city_entry select.city_list' ).rules( 'add', {
    required: {
      depends: function( element ) {
        return is_ma_nh( element );
      }
    }
  });

  $( '.city_entry input.city_input' ).rules( 'add', {
    required: {
      depends: function( element ) {
          return !is_ma_nh( element );
      }
    }
  });

  $( '.city_entry select.state_list' ).rules( 'add', {
    required: true
  });

  $( '.city_entry select.city_list' ).chosen().change( function() {
    $( this ).valid();
  });

  // Define what to do with cities, then call it
  $( '.city_entry select.state_list' ).chosen().change( function() {
    state = $( this ).val();
    city_list = '';
    if (state == 'MA') {
      city_list = ma_cities;
    }
    else if (state == 'NH') {
      city_list = nh_cities;
    }

   if (city_list) {
     $( this ).siblings( 'input.city_input' ).val('').hide();
     load_cities( $( this ).parent(), city_list );
     $( this ).siblings( 'select.city_list' ).next().show();
    }
   else {
     $( this ).siblings( 'input.city_input' ).show();
     $( this ).siblings( 'select.city_list' ).next().hide();
    }
   $( this ).siblings( 'select.city_list' ).trigger( 'chosen:updated' );
  }).change();


  // Used to validate chosen selects
  $( '.city_entry' ).parent( 'form' ).validate().settings.ignore =
		":hidden:not(select), .chosen-search input";

  $( '.city_list' ).each( function() {
    $( this )[0].validate_highlight = function( element, highlight, errorClass, validClass ) {
      // Highlight the chosen field (which is next) instead of the select
      $( element ).next().toggleClass( errorClass, highlight );
    };
  });

});
