//passing normalized stats (which come from db as raw stats) to the client

function normalizeStats(queryData){

    //error handling for if for some reason there was no data for the category
    if (queryData === []){
        //TODO: what should our error resonse be here???
        console.log("empty set");
    }

    var normalizedData = {}; //need to send normalized data to api.js as JSON because the POST sends JSONs
    var max = 0;

    //find the max
    for (state of queryData){
        // console.log(results[2]["Topping"] + "######################");
        // console.log(i.OrderID + "6666666gkgkfkk");
        // console.log(i.OrderID);

        //doesn't matter if we have 2 of the same value, since it doesn't matter which state max comes from
        if (state.value > max){
            max = state.value;
        }

    }

}

module.exports = normalizeStats;
