$(function () {
 getajaxlist();

    var post_id = "";

    $('body').on('click', '.addPost', function (e) {
        e.preventDefault();
        formReset();
        role_id = "";
		
        $('#postModal').modal('show');
    });

    $('body').on('click', '.editpost', function (e) {
        e.preventDefault();
        formReset();
        post_id = $(this).data('id');
        getContent();
        $('#postModal').modal('show');
    });

    $('body').on('click', '.post_desc', function (e) {
        e.preventDefault();
        $('.post_desc_con').data('');
        var html = $(this).data('desc');
        $('.post_desc_con').html(html);
        $('#descModal').modal('show');
        

    });


    $('#postFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "post/addnew",
            type: 'post',
            data: dataS + '&post_id=' + post_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                    $('#postModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deletepost', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        post_id = $(this).data('id');
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                $.ajax({
                    url: ADMIN_HTTP_PATH + "post/deletepost",
                    type: 'post',
                    data: 'post_id=' + post_id,
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
            url: ADMIN_HTTP_PATH + "post/getContent",
            type: 'post',
            data: 'post_id=' + post_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#title').val(data.roledata.title);
                    $('#description').val(data.roledata.description);

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
                "url": ADMIN_HTTP_PATH + "post/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "title"},
               {"data": "description"},
               {"data": "action"},
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});