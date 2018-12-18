$(function () {

    getajaxlist();

    var role_id = "";

    $('body').on('click', '.addRole', function (e) {
        e.preventDefault();
        formReset();
        role_id = "";
        $('#roleModal').modal('show');
    });

    $('body').on('click', '.editRole', function (e) {
        e.preventDefault();
        formReset();
        role_id = $(this).data('id');
        getContent();
        $('#roleModal').modal('show');
    });


    $('#roleFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "role/addnew",
            type: 'post',
            data: dataS + '&role_id=' + role_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                    $('#roleModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deleteRole', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        role_id = $(this).data('id');
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                $.ajax({
                    url: ADMIN_HTTP_PATH + "role/deleteRole",
                    type: 'post',
                    data: 'role_id=' + role_id,
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
            url: ADMIN_HTTP_PATH + "role/getContent",
            type: 'post',
            data: 'role_id=' + role_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#role_title').val(data.roledata.role_title);
                    $('#role_slug').val(data.roledata.role_slug);
                    $('#role_description').val(data.roledata.role_description);

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
                "url": ADMIN_HTTP_PATH + "role/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "role_title"},
                {"data": "role_slug"},
                {"data": "role_description"},
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});