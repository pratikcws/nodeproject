$(function () {

	$('#policeverification').submit(function (e) {
		
        e.preventDefault();
        var dataS = new FormData(this);
        $.ajax({
            url: HTTP_PATH + "badges/policeverification",
            type: 'post',
            data: dataS ,
            processData: false, 
       contentType: false, 
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success").then(function () {
						   $('#makeoffer_modal').modal('hide');
							window.reload();
					
                    });
                  
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });
	
	  $('#comment').submit(function (e) {
		
        e.preventDefault();
        var dataS = new FormData(this);
        dataS.append('project_id', project_id);
        $.ajax({
            url: HTTP_PATH + "post/comment",
            type: 'post',
            data: dataS ,
            processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
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
	
	
	$('body').on('click', '.awarduser', function (e) {
		
        e.preventDefault();
		 var accept_award_id = $(this).attr('accept_award_id') ? $(this).attr('accept_award_id') : "";
         var post_id = $(this).attr('id');
         var awarded_to = $(this).attr('ato');
         var created_by = $(this).attr('cby');
		 var status = $(this).data('status');
		 
		 var confirm_s = confirm('Are you sure ?');
		if(confirm_s){
			$.ajax({
				url: HTTP_PATH + "post/awardproject",
				type: 'post',
				data: 'post_id='+post_id + "&awarded_to=" + awarded_to + "&created_by=" + created_by + "&accept_award_id=" + accept_award_id+"&status="+status,
				dataType: 'json',
				success: function (data, status) {
					errors_remove();
					if (data.success) {
						swal("Good job!", data.success_mess, "success").then(function () {
							
						});
					  window.reload();
					} else {
						errors_display(data.error_mess);
					}
				}
			});
		} 
    });
	
	
	$('body').on('click', '.startachat', function (e) {
        e.preventDefault();

         var post_id = $(this).attr('projectid');
         var to_userid = $(this).attr('to_userid');
         var from_userid = $(this).attr('from_userid');
		 $.ajax({
            url: HTTP_PATH + "post/messagehead",
            type: 'post',
            data: 'post_id='+post_id + "&to_userid=" + to_userid + "&from_userid=" + from_userid,
			dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
					console.log(data);
                    // swal("Good job!", data.success_mess, "success").then(function () {
                     window.location.href = HTTP_PATH+"account/message/";
                    // });
				} else {
                    errors_display(data.error_mess);
                }
            }
        });
    });
	
	
	$('body').on('click', '.paymentRequest', function (e) {
        e.preventDefault();
         var project_id = $(this).data('project');
         var user_id = $(this).data('user');
         var to_userid = $(this).attr('to_userid');
		 $.ajax({
            url: HTTP_PATH + "post/paymentRequest",
            type: 'post',
            data: 'post_id='+project_id + "&user_id=" + user_id+ "&to_userid=" + to_userid,
			dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    swal("Good job!", data.success_mess, "success").then(function () {
						window.reload();
                    });
				}
            }
        });
    });
	
	
$('body').on('change', '#offer_amount', function (e) {
        e.preventDefault();
         var totalamount = $(this).val();
		 var percent = $(this).attr("exp_per");
		 var expertieamount = (percent / 100) * totalamount;
		  $("#expertieamount").append("<b>"+expertieamount+"</b>");
		  $('#expertieprice').val(expertieamount);
		  var taskerrecieve = totalamount-expertieamount;
		  $('#taskerrecieve').val(taskerrecieve);
		  
    });	

// var to_userid = $(this).attr('to_userid');
// $percentage = 5;
// $totalamount = ;

// $new_width = ($percentage / 100) * $totalWidth;


	
	
	
	
	
	

});