function formReset() {
    errors_remove();
    $("input[type='text'],input[type='password'], input[type='email'], textarea").val('');
}

function errors_display(errors) {
    errors_remove();
    for (var i in errors) {
        var elem = $('label[for="' + errors[i].param + '"]').find('.error-dis-deft');
        if (elem != "undefined") {
            $('#' + errors[i].param).addClass('server-error-display');
        } else {
            $('#' + errors[i].param).addClass('server-error-display');
        }
    }
}
function errors_remove() {
    $('.server-error-display').removeClass('server-error-display');
}

function display_date(date) {
    var dis_date = new Date(date);
    return dis_date;
}

