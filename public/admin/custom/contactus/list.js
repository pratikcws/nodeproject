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
            "language": {search: "", searchPlaceholder: "Search..."},
            "ajax": {
                "url": ADMIN_HTTP_PATH + "contactus/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
               {"data": "name"},
               {"data": "email"},
               {"data": "subject"},
               {"data": "message"},
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});