async function send_alert(title, msg, color='red') {
    var alert_box = document.getElementById('alert-box')
    var alert_title = document.getElementById('alert-title')
    var alert_message = document.getElementById('alert-message')

    $('alert-box').toggle()
    alert_box.classList.add('alert-warning') // yellow


//    if (alert_box.classList.contains('show')) {
//        alert_box.classList.remove('show')
//    }

    // if (color == 'red'){
    //     alert_box.classList.remove('alert-info') // blue
    //     alert_box.classList.remove('alert-warning') // yellow
    //     alert_box.classList.add('alert-danger') // red
    //     alert_box.classList.remove('alert-success') // green
    // } else if (color == 'blue'){
    //     alert_box.classList.add('alert-info') // blue
    //     alert_box.classList.remove('alert-warning') // yellow
    //     alert_box.classList.remove('alert-danger') // red
    //     alert_box.classList.remove('alert-success') // green
    // } else if (color == 'yellow'){
    //     alert_box.classList.remove('alert-info') // blue
    //     alert_box.classList.add('alert-warning') // yellow
    //     alert_box.classList.remove('alert-danger') // red
    //     alert_box.classList.remove('alert-success') // green
    // } else if (color == 'green'){
    //     alert_box.classList.remove('alert-info') // blue
    //     alert_box.classList.remove('alert-warning') // yellow
    //     alert_box.classList.remove('alert-danger') // red
    //     alert_box.classList.add('alert-success') // green
    // }

    alert_title.innerHTML = title
    alert_message.innerHTML = msg

    if (alert_box.classList.contains('show')) {
        setTimeout(function(){
            alert_box.classList.add('show')
        }, 1000);
    } else {
        alert_box.classList.add('show')
    }

    setTimeout(function(){
        alert_box.classList.remove('show')
    }, 5000);
}