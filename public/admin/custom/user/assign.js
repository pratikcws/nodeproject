$(function () {

    $('#assognFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "waiter/assignment",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                } else {
                    console.log(data.error_mess);
                }
            }
        });
    });

});


/*
$(function () {

    $('.assign-input').on('click', function (e) {
        e.preventDefault();
        var valu = $(this).val();
        $.ajax({
            url: ADMIN_HTTP_PATH + "waiter/assignment",
            type: 'post',
            data: {
                assign: valu
            },
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                } else {
                    console.log(data.error_mess);
                }
            }
        });
    });

});
*/