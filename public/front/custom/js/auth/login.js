$(function () {

    $("body").on('click', '#loginpopup', function (e) {
        e.preventDefault();
        lead_id = 0;
        $('#loginmodaltest').modal('show');
    });

    if (typeof login_page != 'undefined' && login_page == true) {
        $('#loginmodaltest').modal('show');
    }

    $("body").on('click', '#Forgetpass', function (e) {
        e.preventDefault();
        lead_id = 0;
        $('#Forgetpassmodal').modal('show');
        $('#loginmodaltest').modal('hide');
    });

    $("body").on('click', '#signupmode', function (e) {
        e.preventDefault();
        lead_id = 0;
        $('#loginmodaltest').modal('hide');
        $('#signupmodal').modal('show');
    });


    $('#loginSubmitFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "login/postdata",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    //swal('Welcome', data.success_mess, 'success').then(function () {
                    window.location = HTTP_PATH + "account";
                    //});
                } else if (data.error == 1) {
                    errors_display(data.error_mess);
                } else if (data.error == 2) {
                    swal('Oops..', data.error_mess, 'error');
                }
            }
        });
    });
});