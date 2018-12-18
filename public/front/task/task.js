$(function(){
 var post_id = "";
    $('#addtask').submit(function (e) {
        e.preventDefault();
        var dataS = new FormData(this);//$(this).serialize();
        dataS.append('post_id', post_id);
        $.ajax({
            url: HTTP_PATH + "post/postdata",
            type: 'post',
            data: dataS ,
            processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success").then(function () {
                     window.location.href = HTTP_PATH+"post/details/"+data.data._id;
                    });
                  
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });
	
	

});