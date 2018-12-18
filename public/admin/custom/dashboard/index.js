$(function () {


    $('#serviceextrafee').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "dashboard/servicecharge",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                 } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    


    function getContent() {
        $.ajax({
            url: ADMIN_HTTP_PATH + "post/getContent",
            type: 'post',
            data: 'post_id=' + post_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#title').val(data.roledata.title);
                    $('#description').val(data.roledata.description);

                }
            }
        });
    }

    

});