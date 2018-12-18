$(function () {

    getajaxlist();

    var page_id = "";

    $('body').on('click', '.addPage', function (e) {
        e.preventDefault();
        formReset();
        page_id = "";
        $('#pageModal').modal('show');
    });

    $('body').on('click', '.editPage', function (e) {
        e.preventDefault();
        formReset();
        page_id = $(this).data('id');
        getContent();
        $('#pageModal').modal('show');
    });


    $('#pageFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "pages/addnew",
            type: 'post',
            data: dataS + '&page_id=' + page_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    $('#pageModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deletePage', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        page_id = $(this).data('id');
        var confrm = confirm("Are you sure?");
        if (confrm) {
            $.ajax({
                url: ADMIN_HTTP_PATH + "pages/delete",
                type: 'post',
                data: 'page_id=' + page_id,
                dataType: 'json',
                success: function (data, status) {
                    if (data.success) {
                       refreshTable();
                    }
                }
            });
        }
    });



    function getContent() {
        $.ajax({
            url: ADMIN_HTTP_PATH + "pages/getContent",
            type: 'post',
            data: 'page_id=' + page_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#title').val(data.pagedata.title);
                    $('#slug').val(data.pagedata.slug);
                    $('#description').val(data.pagedata.description);
                }
            }
        });
    }

function refreshTable() {
        var table = $('#pageTable').DataTable();
        table.ajax.reload();
    }

    function getajaxlist() {
        $('#pageTable').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": { search: "",searchPlaceholder: "Search..." },
            "ajax": {
                "url": ADMIN_HTTP_PATH + "pages/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id",  'sortable' : false},
                {"data": "title"},
                {"data": "slug"},
                {"data": "description"},
                {"data": "action",  'sortable' : false}
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });
    
    $('body').on('click','.descPage', function (e) {
        e.preventDefault();
        var html = $(this).data('desc');
        $('.page_desc_con').html('');
        $('.page_desc_con').html(html);
        $('#page_desc_modal').modal('show');
    });

});