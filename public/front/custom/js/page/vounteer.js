$(function () {
    $('#volunteerSubmitFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "page/volunteer",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    window.location = HTTP_PATH + "page/volunteer/success";
                } else if (data.error == 1) {
                    errors_display(data.error_mess);
                } else if (data.error == 2) {

                    $('label[for="email"]').append('<span class="error-dis-deft" style="color:red">(' + data.error_mess + ') *</span>');
                }
            }
        });
    });
});