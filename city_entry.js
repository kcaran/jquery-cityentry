/* $Id: city_entry.js,v 1.2 2014/05/06 20:29:39 caran Exp $ */
var admo_validator;
var labelErrorClass = 'highlight_error';

function is_ma_nh()
 {
  var value = $( '#ad_locstate' ).val();
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

function validate_highlight( element, highlight, errorClass, validClass )
 {
  // Radio buttons
  if ($( element ).attr( 'name' ) === 'ad_loccityname') {
    $( element ).next().toggleClass( errorClass, highlight );
   }
  else {
    validate_toggle( element, highlight, errorClass, validClass );
   }
 }

function validate_toggle( element, highlight, errorClass, validClass )
 {
  $( element.form ).find( 'label[for=' + element.id + ']' ).toggleClass( labelErrorClass, highlight );
  $( element ).toggleClass( errorClass, highlight ).parent( 'label' ).toggleClass( labelErrorClass, highlight );
 }

$(document).ready( function() {

  admo_validator = $( 'form' ).validate({
	errorPlacement: function( error, element ) {},
	'highlight': function( element, errorClass, validClass ) {
       validate_highlight( element, true, errorClass, validClass );
	},
	'unhighlight': function (element, errorClass, validClass) {
       validate_highlight( element, false, errorClass, validClass );
	},
    rules: {
		ad_loccity: {
			required: {
				depends: function( element ) {
				  return !is_ma_nh();
				}
			}
		},

		ad_loccityname: {
			required: {
				depends: function( element ) {
				  return is_ma_nh();
				}
			}
		},

		ad_locstate: {
			required: true
		}
    },
	submitHandler: function( form ) {
      form.submit();
	},
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
     $( '#ad_loccity' ).hide();
     load_cities( $( this ).parent(), city_list );
     $( '#ad_loccityname_chosen' ).show();
    }
   else {
     $( '#ad_loccity' ).show();
     $( '#ad_loccityname_chosen' ).hide();
    }
   $( '#ad_loccityname' ).trigger( 'chosen:updated' );
  }).change();

  // Used to validate chosen selects
  admo_validator.settings.ignore = ":hidden:not(select), .chosen-search input";

});
