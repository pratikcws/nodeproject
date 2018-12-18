$(function () {
$('body').on('click', '#make_an_offer', function (e) {
        e.preventDefault();
		$('#makeoffer_modal').modal('show');
    });
	
	 
        $('body').on('submit', '#createoffer', function (e) {	
        e.preventDefault();
        var dataS = new FormData(this);
        dataS.append('offer_id', offer_id);
        $.ajax({
            url: HTTP_PATH + "post/createoffer",
            type: 'post',
            data: dataS ,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success").then(function () {
						   $('#makeoffer_modal').modal('hide');
                        //    $("#refreshdetails").load(HTTP_PATH+"post/details/" +project_id+ " .task-right");
                        location.reload(true);
					
                    });
                  
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });
    
    
    
	 
		$('body').on('submit', '#comment', function (e) {	
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
		 var servicecharge = $(this).attr('servicecharge');
		 var offer_id = $(this).attr('offer_id');
         var status = $(this).attr('status');
		 
		 var confirm_s = confirm('Are you sure ?');
		if(confirm_s){
			$.ajax({
				url: HTTP_PATH + "post/awardproject",
				type: 'post',
				data: 'post_id='+post_id + "&awarded_to=" + awarded_to + "&created_by=" + created_by  +"&offer_id=" + offer_id + "&accept_award_id=" + accept_award_id+"&status="+status + "&servicecharge=" + servicecharge,
				dataType: 'json',
				success: function (data, status) {
					errors_remove();
					if (data.success) {
						swal("Good job!", data.success_mess, "success").then(function () {
							 $("#refreshdetails").load(HTTP_PATH+"post/details/" +post_id+ " .task-right");
						});
					 
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
                     window.location.href = data.redirect_url;
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
                        $("#refreshdetails").load(HTTP_PATH+"post/details/" +project_id+ " .task-right");
                    });
				}
            }
        });
    });
	
	
$('body').on('change', '#offer_amount', function (e) {
        e.preventDefault();
         var totalamount = $(this).val();
		 var percent = $(this).attr("exp_per");
         console.log(percent);
		 var expertieamount = (percent / 100) * totalamount;
		  $("#expertieamount").html("<b>"+expertieamount+"</b>");
		  $('#expertieprice').val(expertieamount);
		  var taskerrecieve = totalamount-expertieamount;
		  $('#taskerrecieve').val(taskerrecieve);
		  
    });	



// var to_userid = $(this).attr('to_userid');
// $percentage = 5;
// $totalamount = ;

// $new_width = ($percentage / 100) * $totalWidth;

$(document).ready(function() {
    // Configure/customize these variables.
    var showChar = 100;  // How many characters are shown by default
    var ellipsestext = "...";
    var moretext = "Show more >";
    var lesstext = "Show less";
    

    $('.more').each(function() {
        var content = $(this).html();
 
        if(content.length > showChar) {
 
            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);
 
            var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
 
            $(this).html(html);
        }
 
    });
 
    $(".morelink").click(function(){
        if($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
});
	
	
	
	
	
	

});