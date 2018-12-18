$(function () {
$('body').on('submit', '#portfolio', function (e) {
	var portfolio_id ="";
        e.preventDefault();
        var dataS = new FormData(this);//$(this).serialize();
        dataS.append('portfolio_id', portfolio_id);
        
        $.ajax({
            url: HTTP_PATH + "account/portfolio/addnew",
            type: 'post',
            data: dataS, //+ '&category_id=' + category_id,
            
             processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                     $("#portfoliosection").load(HTTP_PATH+"account/my-portfolio #portfoliosection");
                    
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });
	
	

	
	$("body").on('click', '.deleteportfolio', function(e) {
        e.preventDefault();
		var portfolio_id = $(this).attr("id"); 
         var result = confirm('Are you sure ?')
         if(result){
    		$.ajax({
            url: HTTP_PATH + "account/portfolio/deleteportfolio",
            type: 'post',
            data: 'portfolio_id=' + portfolio_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                    if (data.success) {
                        swal("Good job!", data.success_mess, "success");
                        $("#portfoliosection").load(HTTP_PATH+"account/my-portfolio #portfoliosection");
                        
                    } else {
                        errors_display(data.error_mess);
                    }
                }
            });
        }
    });
	
    
});