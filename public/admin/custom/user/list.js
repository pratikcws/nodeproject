$(function () {

    getajaxlist();

    var user_id = "";

    
    $('body').on('click', '.adduser', function (e) {
        e.preventDefault();
        formReset();
        $('#userFrm')[0].reset();
        user_id = "";
        $('#userModal').modal('show');
    });

    $('body').on('click', '.edituser', function (e) {
        e.preventDefault();
        formReset();
        user_id = $(this).data('id');
        getContent();
        $('#userModal').modal('show');
    });


    $('#userFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "user/addnew",
            type: 'post',
            data: dataS + '&user_id=' + user_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                    $('#userModal').modal('hide');
                    refreshTable();
                } else {
					errors_display(data.error_mess);
					if(data.error==2){alert(data.error_mess);}
				 }
            }
        });
    });

    $('body').on('click', '.deleteuser', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        user_id = $(this).data('id');
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                $.ajax({
                    url: ADMIN_HTTP_PATH + "user/deleteuser",
                    type: 'post',
                    data: 'user_id=' + user_id,
                    dataType: 'json',
                    success: function (data, status) {
                        if (data.success) {
                            refreshTable();
                        }
                    }
                });
            }
        });
    });



    function getContent() {
        $.ajax({
            url: ADMIN_HTTP_PATH + "user/getContent",
            type: 'post',
            data: 'user_id=' + user_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#first_name').val(data.userdata.first_name);
                    $('#last_name').val(data.userdata.last_name);
                    $('#email').val(data.userdata.email);
                    $('#mobile_number').val(data.userdata.mobile_no);

                }
            }
        });
    }

    function refreshTable() {
        var table = $('#example').DataTable();
        table.ajax.reload();
    }

    function getajaxlist() {
        $('#example').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": {search: "", searchPlaceholder: "Search..."},
            "ajax": {
                "url": ADMIN_HTTP_PATH + "user/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "full_name"},
                {"data": "email"},
                {"data": "mobile_no"},
                {"data": "action", 'sortable': false}
            ]
			
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });


    function get_branch_by_hotel_user(hotel_selector, target_dropdown, outerdata){
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
                        if(data.branches.length > 0){
                            $html = '<option value="">Select</option>';
                            $.each(data.branches, function( index, element ) {
                                $html += '<option value="'+element._id+'"'
                                if(outerdata.userdata[0].hotelbranchdata[0]._id == element._id)
                                    $html += ' selected="selected" ';
                                $html += '>'+element.branch_name+'</option>';
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

});