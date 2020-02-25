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
    //add in a data argument, grabbed the stat the user has just selected (intead of the hardcoded value)
    //TODO how will we link name of stat requested to the names in the db
    // $.post( "/api", {stat: "crime_rate"}, function( data, status, xhr ) {            
    //     console.log("sent a POST");
    //     //update the map with the information from the JavaScript Object that comes back, which is NOT in JSON notation at this point
    //
    // });
});
