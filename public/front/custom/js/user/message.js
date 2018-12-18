$(function () {

    $('body').on('click', '.completeproject', function (e) {

        e.preventDefault();
        // formReset();
        $('#completeprojmodal').modal('show');
    });

    $('body').on('click', '.requesttocomplete', function (e) {
        e.preventDefault();
        formReset();
        $('#requesttocomplete').modal('show');
    });





    $('body').on('submit', '#msg', function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "account/projectmessages",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    $("#refreshboxid").load(location.href + " #refreshboxid");
                    $('#write_msg').val('');
                } else if (data.error == 1) {
                    errors_display(data.error_mess);
                } else if (data.error == 2) {
                    swal('Oops..', data.error_mess, 'error');
                }
            }
        });
    });
});

$( document ).ready(function() {
    setInterval(function(){

$("#all_msg").load(HTTP_PATH+"account/message/" + msgheadid + " #all_msg");
    }, 2000);
   
});

