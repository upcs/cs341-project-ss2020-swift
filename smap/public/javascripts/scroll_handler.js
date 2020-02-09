$("document").ready(function(){
    $("#arrow").click(function(e) {
        // For now, just toggle the classes that enable viewing
        $("#app_container").toggleClass("hidden");
        $("#divisor").toggleClass("hidden");
        $("#bottom_bar").toggleClass("about_position");
    });
});
