$(function () {
	
	$("body").on('click', '#signuppopup', function(e) {
        e.preventDefault();
        lead_id = 0; 
        $('#signupmodal').modal('show');
    });
    
    
    if(typeof signup_page != 'undefined' && signup_page == true){
        $('#signupmodal').modal('show');
    }
	

	$("body").on('click', '#loginopen', function(e) {
        e.preventDefault();
        lead_id = 0; 
        $('#loginmodaltest').modal('show');
		$('#signupmodal').modal('hide');
	});
	
	
    $('#SignupSubmitFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: HTTP_PATH + "signup/postdata",
            type: 'post',
            data: dataS,
            dataType: 'json',
            success: function (data, status) {
                $('span.error-dis-deft').remove();
                errors_remove();
                if (data.success) {
                    //swal('Welcome', data.success_mess, 'success').then(function () {
                        window.location = HTTP_PATH+"account";
                    //});
                } else if (data.error == 1) {
                    errors_display(data.error_mess);
                } else if (data.error == 2) {

                    $('label[for="email"]').append('<span class="error-dis-deft" style="color:red">(' + data.error_mess + ') *</span>');
                }
            }
        });
    });
});