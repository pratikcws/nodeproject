$(function () {
	
    $('#forgetFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "forgetpass/postdata",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
             
            }
        });
    });
});