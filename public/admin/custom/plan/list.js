$(function () {

    getajaxlist();

    var plan_id = "";

    $('body').on('click', '.addPlan', function (e) {
        e.preventDefault();
        formReset();
        plan_id = "";
        $('#planModal').modal('show');
    });

    $('body').on('click', '.editPage', function (e) {
        e.preventDefault();
        formReset();
        plan_id = $(this).data('id');
        getContent();
        $('#planModal').modal('show');
    });


    $('#planFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "plan/addnew",
            type: 'post',
            data: dataS + '&plan_id=' + plan_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    $('#planModal').modal('hide');
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
        plan_id = $(this).data('id');
        var confrm = confirm("Are you sure?");
        if (confrm) {
            $.ajax({
                url: ADMIN_HTTP_PATH + "plan/delete",
                type: 'post',
                data: 'plan_id=' + plan_id,
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
            url: ADMIN_HTTP_PATH + "plan/getContent",
            type: 'post',
            data: 'plan_id=' + plan_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#title').val(data.pagedata.title);
                    $('#price').val(data.pagedata.price);
                    $('#days').val(data.pagedata.days);
					$('#description').val(data.pagedata.description);
                    $('#slug').val(data.pagedata.slug);
                    
                }
            }
        });
    }

function refreshTable() {
        var table = $('#planTable').DataTable();
        table.ajax.reload();
    }

    function getajaxlist() {
        $('#planTable').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": { search: "",searchPlaceholder: "Search..." },
            "ajax": {
                "url": ADMIN_HTTP_PATH + "plan/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id",  'sortable' : false},
                {"data": "title"},
				 {"data": "price"},
				 {"data": "days"},
				 {"data": "description"},
                {"data": "slug"},
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