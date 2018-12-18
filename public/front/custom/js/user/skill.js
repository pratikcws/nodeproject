$(function () {
    $('#skill-form').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "account/skill_add",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal('Welcome', data.success_mess, 'success').then(function () {
                        //window.location = HTTP_PATH+'account';
                    });
                } else if (data.error == 1) {
                    errors_display(data.error_mess);
                } else if (data.error == 2) {
                    swal('Oops..', data.error_mess, 'error');
                }
            }
        });
    });
});