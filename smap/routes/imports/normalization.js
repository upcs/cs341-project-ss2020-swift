//passing normalized stats (which come from db as raw stats) to the client

"use strict";

const states = require("./constants").states;

function normalizeStats(row){
    //Whether we should find the min or the max
    console.log("row" + row);

    let invert = row["invert_flag"] !== 0;
    let compare = invert ? Math.min : Math.max;

    var best = row["AL"];

    //find the best
    for (let state of states){
        best = compare(best, row[state]);
    }

    //Normalize
    for (let state of states){
        row[state] /= best;
        if (invert){
          row[state] = 1 - row[state];
        }
    }
}

module.exports = normalizeStats;
