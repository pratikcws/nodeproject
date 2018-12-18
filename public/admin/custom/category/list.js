$(function () {

    getajaxlist();

    var category_id = "";

    $('body').on('click', '.addCategory', function (e) {
        e.preventDefault();
        formReset();
        category_id = "";
        $('#categoryModal').modal('show');
    });

    $('body').on('click', '.editcategory', function (e) {
        e.preventDefault();
        formReset();
        category_id = $(this).data('id');
        getContent();
        $('#categoryModal').modal('show');
    });

		
    $('#cateFrm').submit(function (e) {
        e.preventDefault();
        var dataS = new FormData(this);//$(this).serialize();
        dataS.append('category_id', category_id);
        dataS.append('parent_id', parent_id);
        $.ajax({
            url: ADMIN_HTTP_PATH + "category/addnew",
            type: 'post',
            data: dataS, //+ '&category_id=' + category_id,
            //dataType: 'json',
             processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                    $('#categoryModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deletecategory', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        category_id = $(this).data('id');
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                $.ajax({
                    url: ADMIN_HTTP_PATH + "category/deletecategory",
                    type: 'post',
                    data: 'category_id=' + category_id,
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
            url: ADMIN_HTTP_PATH + "category/getContent",
            type: 'post',
            data: 'category_id=' + category_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#title').val(data.roledata.title);
					$('#description').val(data.roledata.description);
					$('#parent_id').val(data.roledata.parent_id);

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
                "url": ADMIN_HTTP_PATH + "category/ajaxlist",
                "type": "POST",
				"data": function ( d ) {
                d.parent_id = parent_id;
                
            }
            },
            "columns": [
                {"data": "_id", 'sortable': false},
				//{"data": "parent_id"},
                {"data": "image", 'sortable': false},
                {"data": "title"},
                {"data": "description"},
                {"data": "action", 'sortable': false},
                //{"data": "subcategory", 'sortable': false},
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});