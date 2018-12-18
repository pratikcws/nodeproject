$(function(){
$('body').on('submit', '#update_profile', function (e) {

	var portfolio_id ="";
        e.preventDefault();
        var dataS = new FormData(this);
        $.ajax({
            url: HTTP_PATH + "account/addprofile",
            type: 'post',
            data: dataS, 
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                    $("#userprofile").load(HTTP_PATH+"account/profile #userprofile");
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

$("#update_profile").validate({
  rules: {
    first_name: {
      required: true,
      minlength: 3
    },
    last_name: {
      required: true,
      minlength: 3
    }
  }
});

}); 

