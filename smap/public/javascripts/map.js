 "use strict";

$("document").ready( function() {
    // The inital top element
    // Get the Object by ID
    var svg = document.getElementById("us-map");
    // Get the SVG document inside the Object tag
    var svgDoc = svg.contentDocument;
    // Get one of the SVG items by ID;
    // var svgItem = svgDoc.getElementById(state);
    var top_element = $("#AK", svgDoc);
    console.log(top_element);
    // When mousing over a state
    $("path", svgDoc).mouseenter( function() {
        // Put it on top
        $(this).insertAfter(top_element);
        top_element = $(this);
        // Set styling
        $(this).css("filter", "contrast(85%) brightness(115%)").css("stroke-width", "3");
    // Return the styling on leaving
    }).mouseleave( function() {
        $(this).css("filter", "brightness(100%) contrast(100%)").css("stroke-width", "1");
    });
});
