$(function () {
 getajaxlist();


    function refreshTable() {
        var table = $('#example').DataTable();
        table.ajax.reload();
    }

    function getajaxlist() {
        $('#example').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": {search: "", searchPlaceholder: "Search by transaction id"},
            "ajax": {
                "url": ADMIN_HTTP_PATH + "transaction/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "user_id"},
               {"data": "post_id"},
               {"data": "trans_id"},
               {"data": "amount"},
               {"data": "payment_type"},
               {"data": "payment_mode"},
               {"data": "payment_status"},
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});