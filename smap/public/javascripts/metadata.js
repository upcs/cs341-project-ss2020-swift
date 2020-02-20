$("document").ready(function(){
    $(".metadata_button").click(function(e) {
        window.alert("This is the metadata about your statistic. More will be added soon.");
    });
    //add in a data argument, grabbed the stat the user has just selected (intead of the hardcoded value)
    //TODO how will we link name of stat requested to the names in the db
    $.post( "/api", {stat: "crime_rate"}, function( data, status, xhr ) {            
        console.log("sent a POST");
        //update the map with the information from the JavaScript Object that comes back, which is NOT in JSON notation at this point
        
    });
});
