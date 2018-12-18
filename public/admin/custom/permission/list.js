$(function () {

    getajaxlist();

    var permission_id = "";

    $('body').on('click', '.addPermission', function (e) {
        e.preventDefault();
        formReset();
        permission_id = "";
        $('#permissionModal').modal('show');
    });

    $('body').on('click', '.editPermission', function (e) {
        e.preventDefault();
        formReset();
        permission_id = $(this).data('id');
        getContent();
        $('#permissionModal').modal('show');
    });


    $('#permissionFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "permission/addnew",
            type: 'post',
            data: dataS + '&permission_id=' + permission_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                    $('#permissionModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deletePermission', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        permission_id = $(this).data('id');
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                $.ajax({
                    url: ADMIN_HTTP_PATH + "permission/deletePermission",
                    type: 'post',
                    data: 'permission_id=' + permission_id,
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
            url: ADMIN_HTTP_PATH + "permission/getContent",
            type: 'post',
            data: 'permission_id=' + permission_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#permission_title').val(data.permissiondata.permission_title);
                    $('#permission_slug').val(data.permissiondata.permission_slug);
                    $('#permission_description').val(data.permissiondata.permission_description);

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
                "url": ADMIN_HTTP_PATH + "permission/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "permission_title"},
                {"data": "permission_slug"},
                {"data": "permission_description"},
                {"data": "action", 'sortable': false}
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});