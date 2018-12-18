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
            "language": {search: "", searchPlaceholder: "Search "},
            "ajax": {
                "url": ADMIN_HTTP_PATH + "paymentrequest/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "user_id"},
               {"data": "acc_holder_name"},
               {"data": "bsb"},
               {"data": "acc_number"},
               {"data": "amount"},
               
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});