// const form = document.getElementById('form-login');
const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// track page
const sliderPanel = document.getElementById('sliderPanel')

$('#form-login').on('change', function(input) {
    if( input.target.name == 'email' ) {
        if( !regex.test( input.target.value )) {
            send_alert('wring', 'message', 'green')
            return
        }
    }
})

$('sliderPanel').on('slide.bs.carousel', function (panel) {
    var id = panel.relatedTarget.id;

    // clear listeners
    $("input[name=email]").each( function(){
        if(regex.test( $(this).val() )) {
            alert('wring')
            return
         }
    })

    $('#form-login').on('change', function() {
        console.log($(this).children('input[name=email]').prevObject[0].val())

        if(regex.test( $(this).children('input[name=email]').val() )) {
            alert('wring')
            return
         }
    })

    switch (id) {
      case "0":

        break;
      case "1":
        // do something the id is 2
        break;
      case "2":
        // do something the id is 3
        break;
      default:
        //the id is none of the above
    }
  })



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

