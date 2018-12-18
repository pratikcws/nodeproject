$(function () {


    $('body').on('keyup', '#req_amount', function (e) {
        e.preventDefault();
        var request_Amount = $(this).val();
        if (request_Amount > available_balance) {
            $('#btnsbmt').prop('disabled', true);
        } else {
            $('#btnsbmt').prop('disabled', false);
        }
    });
    $('body').on('submit', '#releasefundrequest', function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        var request_Amount = $('#req_amount').val();
        if (request_Amount <= available_balance) {
            $.ajax({
                url: HTTP_PATH + "user/releasefundrequest",
                type: 'post',
                data: dataS,
                dataType: 'json',
                success: function (data, status) {
                    errors_remove();
                    if (data.success) {
                        // $("#refreshboxid").load(location.href + " #refreshboxid");
                        // $('#msg').scrollTop = $('#msg').scrollHeight;
                        swal('Welcome', data.success_mess, 'success').then(function () {

                        });
                    } else if (data.error == 1) {
                        errors_display(data.error_mess);
                    } else if (data.error == 2) {
                        swal('Oops..', data.error_mess, 'error');
                    }
                }
            });
        }
    });
});