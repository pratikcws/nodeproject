$(function () {

    $("body").on('click', '#loginopen', function (e) {
        e.preventDefault();
        lead_id = 0;
        $('#loginmodaltest').modal('show');
        $('#Forgetpassmodal').modal('hide');
    });

    $("body").on('click', '#loginopen', function (e) {
        e.preventDefault();
        lead_id = 0;
        $('#loginmodaltest').modal('show');
        $('#Forgetpassmodal').modal('hide');
    });

    $("body").on('click', '#signupmode', function (e) {
        e.preventDefault();
        lead_id = 0;
        $('#Forgetpassmodal').modal('hide');
        $('#signupmodal').modal('show');
    });



    $('#forgetFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "forgetpass/postdata",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    formReset();
                    swal('', data.success_mess, 'success');
                } else if (data.error == 1) {
                    errors_display(data.error_mess);
                } else {
                    swal('', data.error_mess, 'error');
                }
            }
        });
    });

    $('#resetFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "resetpassword/postdata",
            type: 'post',
            data: dataS + "&reset_token=" + reset_token + "&user_key=" + user_key,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    formReset();
                    swal('', data.success_mess, 'success').then(function () {
                        window.location = HTTP_PATH + "login";
                    });
                } else if (data.error == 2) {
                    swal('', data.error_mess, 'error');
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });
});