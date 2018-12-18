$(function () {
    $('#mobileverification').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "account/mobileverification",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal('Welcome', data.success_mess, 'success').then(function () {
                         $("#otp").modal('show');
                    });
                } 
				else{
					 $("#otp").modal('hide');
				}
            }
        });
    });
	
	
	
	
	$('#otpform').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "account/otp",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal('Welcome', data.success_mess, 'success').then(function () {
                       $("#otp").modal('hide');
                    });
					
                } else{
					swal('', data.error_mess, 'error');
				}
            },
			
        });
    });
});