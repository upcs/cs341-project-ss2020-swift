$(document).ready(function(){
    var lastMove = 0;
    // TODO: Fix to work when about section exists.
    $("#arrow").click( function() {
        $(window).scrollTop(789);
    });

    $(window).scroll( function() {
        scroll_val = Math.floor($(this).scrollTop());
        console.log("Scroll value: " + scroll_val);
        if(Date.now() - lastMove > 16) {
            $("#settings").css("left", -1*scroll_val);
            $("#map-container").css("filter", "opacity(" + ((888 - scroll_val) / 888) + ")");
            lastMove = Date.now();
        }
    });
});
