$("document").ready(function(){
    // If either of the (i) are clicked, alert the user of a dummy alert.
    // TODO: Add in retrieval of the metadata
    // TODO: Remake with custom alert template
    $(".statistic-slider-metadata").click(function(e) {
        window.alert("This is the metadata about your statistic (from slider card). More will be added soon.");
    });
    $(".statistic-option-metadata").click(function(e) {
        window.alert("This is the metadata about your statistic (from selector card). More will be added soon.");
    });
});
