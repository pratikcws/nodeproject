function formReset() {
    errors_remove();
    $("input[type='text'],input[type='password'], input[type='email'], textarea").val('');
}

function errors_display(errors) {
  if($.isArray(errors)){
    for (var i in errors) {
       var elem = $('label[for="' + errors[i].param + '"]').find('.error-dis-deft');
        if(elem != "undefined"){
         $('label[for="' + errors[i].param + '"] .error-dis-deft').remove();   
         $('label[for="' + errors[i].param + '"]').append('<span class="error-dis-deft" style="color:red">(' + errors[i].msg + ') *</span>');   
        }else{
            $('label[for="' + errors[i].param + '"]').append('<span class="error-dis-deft" style="color:red">(' + errors[i].msg + ') *</span>');
        }
    }
  }else{
    $(".error-msg-foot").html('<span class="error-dis-deft" style="color:red"> '+errors+' </span>');
  }
}

function errors_remove() {
    $('.error-dis-deft').remove();
}

function display_date(date) {
   var dis_date = new Date(date);
   return dis_date;
}

function get_branch_by_hotel(hotel_selector, target_dropdown){
    hotel_selector = $(hotel_selector);
    
    var hotel = hotel_selector.val();
    var $html = '<option value="">No Branches</option>';

    if(hotel == ''){
        $(target_dropdown).html($html);
    }else{
        $.ajax({
            url: HTTP_PATH + "common/branch_by_hotel",
            type: 'post',
            data: {
                hotel_id: hotel
            },
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    console.log(data.branches.length);
                    if(data.branches.length > 0){
                        $html = '<option value="">Select</option>';
                        $.each(data.branches, function( index, element ) {
                            $html += '<option value="'+element._id+'">'+element.branch_name+'</option>';
                        });
                        
                    }else{
                        $html = '<option value="">No Branches</option>';
                    }
                } else {
                    $html = '<option value="">No Branches</option>';                  
                }

                $(target_dropdown).html($html);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                /* Act on the event */
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
    
}

function get_zone_by_branch(branch_selector, target_dropdown){
    branch_selector = $(branch_selector);
    
    var branch = branch_selector.val();
    var $html = '<option value="">No Zones</option>';

    if(branch == ''){
        $(target_dropdown).html($html);
    }else{
        $.ajax({
            url: HTTP_PATH + "common/zone_by_branch",
            type: 'post',
            data: {
                branch_id: branch
            },
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    if(data.zones.length > 0){
                        $html = '<option value="">Select</option>';
                        $.each(data.zones, function( index, element ) {
                            $html += '<option value="'+element._id+'">'+element.zone_name+'</option>';
                        });
                    }else{
                        $html = '<option value="">No Zones</option>';
                    }
                } else {
                    $html = '<option value="">No Zones</option>';
                }

                $(target_dropdown).html($html);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                /* Act on the event */
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
}

$('body').on('click', '.back_to_history', function(e){
    e.preventDefault();
    history.back(1);
});
