jQuery.fn.status = function() {
    return this.each(function() {
        $(this).html("Status");
    });
}