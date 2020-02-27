'use strict';

// Weight is a value between 0 and 1
// 0 is low, 1 is high
function mix_color(weight) {
    // Get the theme colors
    var min_string = $(":root").css("--color-light");
    var max_string = $(":root").css("--accent-color");
    // Get the text from the inside of the "rgba(_______);"
    var min_data = min_string.split("(")[1].split(")")[0];
    var max_data = max_string.split("(")[1].split(")")[0];
    // Split the string into a list of strings based on whitetext/commas
    min_data = min_data.split(/[\s,]+/);
    max_data = max_data.split(/[\s,]+/);
    // Change each of the values to numbers
    for (var color_channel of min_data) {
        color_channel = Number(color_channel);
    }
    for (var color_channel of max_data) {
        color_channel = Number(color_channel);
    }
    // Weight the values
    min_data[0] *= (1 - weight);
    min_data[1] *= (1 - weight);
    min_data[2] *= (1 - weight);
    max_data[0] *= weight;
    max_data[1] *= weight;
    max_data[2] *= weight;
    // Make a result array and return a string based on this value
    var result = [ min_data[0]+max_data[0], min_data[1]+max_data[1], min_data[2]+max_data[2] ];
    return ("rgba("+ result[0] +", "+ result[1] +", "+ result[2] +", 1)");
}

function get_border_color() {
    return $(":root").css("--secondary-color-dark");
}

function color_state(state, weight) {
    // Get the Object by ID
    var svg = document.getElementById("us-map");
    // Get the SVG document inside the Object tag
    var svgDoc = svg.contentDocument;
    // Get one of the SVG items by ID;
    var svgItem = svgDoc.getElementById(state);
    // Set the colour to something else
    var border = get_border_color();
	console.log(svgItem);
    svgItem.setAttribute("style", "stroke-width: 1; stroke: "+border+"; fill: "+mix_color(weight)+";");
}

if (typeof module !== "undefined" && module.exports){
  module.exports = mix_color;
}