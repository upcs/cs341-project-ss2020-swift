 "use strict";

$("document").ready( function() {
    // The inital top element
    var top_element = $("#AK");
    // When mousing over a state
    $("path").mouseenter( function() {
        // Put it on top
        $(this).insertAfter(top_element);
        top_element = $(this);
        // Set styling
        $(this).attr("stroke-width", "3").css("filter", "contrast(85%) brightness(115%)");
    // Return the styling on leaving
    }).mouseleave( function() {
        $(this).attr("stroke-width", "1").css("filter", "brightness(100%) contrast(100%)");
    });
});
