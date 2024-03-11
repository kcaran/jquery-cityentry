/* $Id: jquery.cityentry.js,v 1.4 2014/05/19 18:07:29 caran Exp $ */
/* global jQuery */
/* global ma_cities */
/* global nh_cities */

(function( $ ) {
  'use strict';

  $.fn.cityentry = function( initState, initCity ) {
    var $cityentryObj = this;

    $cityentryObj.children( 'select.city_list' ).chosen();

    // Define what to do with cities, then call it
    $cityentryObj.children( 'select.state_list' ).chosen().change( function() {
      var state = $( this ).val();
      var city_list = '';
      if (state === 'MA') {
        city_list = ma_cities;
      }
      else if (state === 'ME') {
        city_list = me_cities;
      }
      else if (state === 'NH') {
        city_list = nh_cities;
      }

      if (city_list) {
        $( this ).siblings( 'input.city_input' ).val('').hide();
        load_cities( $cityentryObj, city_list );
        $( this ).siblings( 'select.city_list' ).next( '.chosen-container' ).show();
      }
      else {
        $( this ).siblings( 'input.city_input' ).show();
        $( this ).siblings( 'select.city_list' ).next( '.chosen-container' ).hide();
      }

     $( this ).trigger( 'chosen:updated' );
     $( this ).siblings( 'select.city_list' ).trigger( 'chosen:updated' );

    }).change();

    validation_rules( $cityentryObj );

    init_state_city( $cityentryObj, initState, initCity );

    return this;
   };

  function init_state_city( $obj, state, city )
   {
    if ($obj === null || !state) {
      return false;
    }

    $obj.children( 'select.state_list' ).val( state ).change();
    if (state === 'MA' || state == 'ME' || state === 'NH') {
      $obj.children( 'select.city_list' ).val( city ).change().trigger( 'chosen:updated' );
    }
    else {
      $obj.children( 'input.city_input' ).val( city ).change();
    }
   }

  function is_ma_nh( element )
   {
    var value = $( element ).siblings( 'select.state_list' ).val();
    return (value === 'MA' || state == 'ME' || value === 'NH');
   }

  function load_cities( cityentryObj, list )
   {
    var $citylist = $( cityentryObj ).children( '.city_list' );

    var option_html = [ '<option value=""></option>' ];
    var disabled = false;
    for (var i = 0; i < list.length; i++) {
      option_html.push( '<option>', list[i], '</option>' );
    }
    if (!option_html.length) {
      option_html.push( '<option>Non MA/ME/NH Location</option>' );
      disabled = true;
    }

    $citylist.html( option_html.join( '' ) ).prop( 'disabled', disabled );
   }

  function validation_rules( $obj )
   {
    // Set-up validation rules
    $obj.children( 'select.city_list' ).rules( 'add', {
      required: {
        depends: function( element ) {
          return !$( element ).attr( 'disabled' ) && is_ma_nh( element );
        }
      }
    });

    $obj.children( 'input.city_input' ).rules( 'add', {
      required: {
        depends: function( element ) {
          return !$( element ).attr( 'disabled' ) && !is_ma_nh( element );
        }
      }
    });

    $obj.children( 'select.state_list' ).rules( 'add', {
      required: {
        depends: function( element ) {
          return !$( element ).attr( 'disabled' );
        }
      }
    });

    $obj.children( 'select.city_list' ).change( function() {
      $( this ).valid();
    });

    $obj.children( '.city_list' ).each( function() {
      $( this )[0].validate_highlight = function( element, highlight, errorClass ) {
       // Highlight the chosen field (which is next) instead of the select
       $( element ).next( '.chosen-container' ).toggleClass( errorClass, highlight );
      };
    });

    // Used to validate chosen selects
    $obj.parents( 'form' ).validate().settings.ignore =
				':hidden:not(select), .chosen-search input';
   }
  
}( jQuery ));
