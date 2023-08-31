
function change_username() {
    $.ajax({
        url: "/auth/change",
        type: "post",
        dataType: "json",
        data: {
            "newName":$('#save-username-input').val()
        },
        success: function(resp) {
            console.log('good:' + resp.newGame)
            console.log('good:' + JSON.stringify(resp))

            $('#dropdownMenuButton1').html(resp.newGame)
            // document.getElementById('dropdownMenuButton1').val(newName)
        },
        error: function(e) {
            console.log('error:' + e)
            send_alert('Error', 'Could not change your name at this time.')
        }
    })
}