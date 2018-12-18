$('#contactus').submit(function (e) {
		e.preventDefault();
        var dataS = new FormData(this);
        $.ajax({
            url: HTTP_PATH + "contactus/add",
            type: 'post',
            data: dataS ,
            processData: false,  
			contentType: false,  
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success").then(function () {
                    // window.location.href = HTTP_PATH+"account/payment-methods;
                    });
                  
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });