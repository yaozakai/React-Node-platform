// const form = document.getElementById('form-login');
const regex_email = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
const regex_password =  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/

// track page
const sliderPanel = document.getElementById('sliderPanel')

$('#reg-username').on('keyup', function(input) {
  if( input.target.value.length > 0 ) {
    $('#username-check').removeClass('bi-dash-square')
    $('#username-check').addClass('bi-check-square')
  } else {
    $('#username-check').removeClass('bi-check-square')
    $('#username-check').addClass('bi-dash-square')
  }
  check_validators()
})

$('#reg-email').on('keyup', function(input) {
  if( regex_email.test( input.target.value )) {
    $('#email-check').removeClass('bi-dash-square')
    $('#email-check').addClass('bi-check-square')
  } else {
    $('#email-check').removeClass('bi-check-square')
    $('#email-check').addClass('bi-dash-square')
  }
  check_validators()
})

// password validation (verify twice)
$('#reg-password-verify').on( "keyup", function() {
  // verify password twice
  if( this.value === $('#reg-password').val() ){
    $('#password-check-verify').removeClass('bi-dash-square')
    $('#password-check-verify').addClass('bi-check-square')
  } else {
    $('#password-check-verify').removeClass('bi-check-square')
    $('#password-check-verify').addClass('bi-dash-square')
  }
  check_validators()
})

// password validation
$('#reg-password').on( "keyup", function() {
  // verify password twice
  if( this.value === $('#reg-password-verify').val() ){
    $('#password-check-verify').removeClass('bi-dash-square')
    $('#password-check-verify').addClass('bi-check-square')
  } else {
    $('#password-check-verify').removeClass('bi-check-square')
    $('#password-check-verify').addClass('bi-dash-square')
  }
  // lowercase letters
  var regex = /[a-z]/
  if( regex.test( this.value ) ){
    $('#password-check-letter').removeClass('bi-dash-square')
    $('#password-check-letter').addClass('bi-check-square')
  } else {
    $('#password-check-letter').removeClass('bi-check-square')
    $('#password-check-letter').addClass('bi-dash-square')
  }
  // uppercase letters
  var regex = /[A-Z]/
  if( regex.test( this.value ) ){
    $('#password-check-capital').removeClass('bi-dash-square')
    $('#password-check-capital').addClass('bi-check-square')
  } else {
    $('#password-check-capital').removeClass('bi-check-square')
    $('#password-check-capital').addClass('bi-dash-square')
  }
  // numbers
  var regex = /[0-9]/
  if( regex.test( this.value ) ){
    $('#password-check-number').removeClass('bi-dash-square')
    $('#password-check-number').addClass('bi-check-square')
  } else {
    $('#password-check-number').removeClass('bi-check-square')
    $('#password-check-number').addClass('bi-dash-square')
  }
  // specials
  var regex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
  if( regex.test( this.value ) ){
    $('#password-check-special').removeClass('bi-dash-square')
    $('#password-check-special').addClass('bi-check-square')
  } else {
    $('#password-check-special').removeClass('bi-check-square')
    $('#password-check-special').addClass('bi-dash-square')
  }
  // length
  var regex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
  if( this.value.length >= 8 ){
    $('#password-check-length').removeClass('bi-dash-square')
    $('#password-check-length').addClass('bi-check-square')
  } else {
    $('#password-check-length').removeClass('bi-check-square')
    $('#password-check-length').addClass('bi-dash-square')
  }
  check_validators()
});

$('#form-login').on('change', function(input) {
  if( input.target.name == 'email' ) {
    if( !regex_email.test( input.target.value )) {
      send_alert('Invalid email format', '')
      return
    }
  }
})

$('#form-forgot').on('change', function(input) {
    if( input.target.name == 'email' ) {
        if( !regex_email.test( input.target.value )) {
            send_alert('Invalid email format', '')
            return
        }
    }
})

function check_validators() {
  var gatekeeper = true
  $('.validator').each(function(){
    // check all validators
    if( $(this).hasClass('bi-dash-square') ){
      gatekeeper = false
    }
  })
  if( gatekeeper ){
    $('#register-submit').removeClass('disabled')
  } else {
    $('#register-submit').addClass('disabled')
  }
}



// function setRegisterFormAction(form) {
//     form.action = "/auth/register";
//     alert(form.action);
//     return false;
//   }

// function setLoginFormAction(form) {
//     form.action = "/auth/login";
//     alert(form.action);
//     return false;
//   }

