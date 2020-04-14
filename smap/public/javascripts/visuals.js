'use strict';

const blur_elements = [
    "nav-bar", "settings", "map-container", "about-container", "ne-inspector-container"
];
const us_state_names = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
    CO: "Colorado", CT: "Connecticut", DE: "Deleware", FL: "Florida", GA: "Georgia",
    HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
    KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts",
    MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
    NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
    NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
    OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
    SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
    VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia",
    WI: "Wisconson", WY: "Wyoming"
};
const ne_state_names = {
    CT: "Connecticut", DE: "Deleware", ME: "Maine", MD: "Maryland", MA: "Massachusetts",
    NH: "New Hampshire", NJ: "New Jersey", NY: "New York", PA: "Pennsylvania",
    RI: "Rhode Island", VT: "Vermont"
}
const themes = [
    "orange-red", "green-blue", "pink-purple", "dark-red", "dark-green", "dark-blue"
];
const ne_states = ["MA", "CT", "NH", "RI", "VT", "DE", "MD", "MJ", "NY", "PA", "ME", "NJ"];

var chart;
var theme_brightness = "light";
var lastMove = 0;

$("document").ready(function () {

    /**************************** LOADING *****************************/
    /** All the functions pertaining to loading the website properly **/
    /******************************************************************/

    /**
     * @param {setInverval} loop the loading loop we're supposed to break and replace with the loading screen
     *      saying it is ready
     */
    function clear_loading(loop) {
        // Stop the triple dot loading loop
        window.setTimeout(function() {
            clearInterval(loop);
        }, 500);
        // Make the dots disappear
        $("#dot1").animate({opacity: "0"}, 500, "swing");
        $("#dot2").animate({opacity: "0"}, 500, "swing");
        $("#dot3").animate({opacity: "0"}, 500, "swing");
        window.setTimeout(function() {
            // Remove the ellipses container
            $("#ellipses").slideUp(1000);
            // Fade out the
            $("#loading").animate({opacity: "0"}, 500);
            $("#orange-red").click();
            // Change the "loading assets" to say we're ready and fly it in
            window.setTimeout(function() { $("#loading").html("Ready!"); }, 500 );
            $("#loading").animate({opacity: "1", fontSize: "50px"}, 500);
            // Fade out the loading window now that we're done with it
            window.setTimeout(function() {
                $("#init").css("pointer-events","none");
                $("#init").animate({opacity: "0"}, 500);
                $("#loading").animate({fontSize: "100px"}, 400);
            }, 1500 );
        }, 1000);
        // Print load time
        let load_time = (window.performance.now() / 1000);
        console.log("Page load time: " + load_time + "s");
        console.log("Time until page operable: "+ (load_time+2.5) +"s");
    }


    /**
     * @param {function} callback the clear_loading function
     * @param {setInterval} loop the loop we're supposed to pass into the callback function
     */
    function preload(callback, loop) {
        // Remove the NE-magnifier (only open in the first place to trigger load event)
        $("#ne-magnifier").css("display", "none");
        // Check to see if the maps loaded (browser compatibility)
        let us_map_document = $("#us-map").length;
        let ne_map_document = $("#ne-map").length;
        // Do not complete and callback if we're not done
        if (us_map_document === 0 || ne_map_document === 0){
            return;
        }
        setupHovering();
        prepareStateWindow();
        populateStateWindow(true); //is_ne is true
        populateStateWindow(false); //is_ne is false
        callback(loop);
    }

    // Loading loop that shows up while elements are loading
    var ellipses_loop = setInterval(function() {
        // Simply fade in and grow / fade out and shrink dots for a loading effect to watch while
        // the page is preloading elements
        $("#dot1").animate({opacity: "0", fontSize: "60px"}, 500, "swing");
        $("#dot1").animate({opacity: "1", fontSize: "80px"}, 500, "swing");
        window.setTimeout(function() {
            $("#dot2").animate({opacity: "0", fontSize: "60px"}, 500, "swing");
            $("#dot2").animate({opacity: "1", fontSize: "80px"}, 500, "swing");
            window.setTimeout(function() {
                $("#dot3").animate({opacity: "0", fontSize: "60px"}, 500, "swing");
                $("#dot3").animate({opacity: "1", fontSize: "80px"}, 500, "swing");
            }, 250);
        }, 250);
    }, 1000 );

    // Map Preloading Functions: If the map wasn't loaded by the browser, preload it anyway for
    // other functions to use to do the prep work
    $.get("/images/us.svg", "", function(xhr, status, res){
      if (status !== "success"){
        console.error("Could not get US map");
      }
      let doc = xhr.documentElement;
      // Give the element the following parameters
      doc.id = "us-map";
      doc.style.width = "100%";
      doc.style.height = "100%";
      // Put it in the container
      $("#map-container").append(doc);
      // Check if we need to load anything more
      preload(clear_loading, ellipses_loop);
    });
    // See above
    $.get("/images/ne.svg", "", function(xhr, status, res){
      if (status !== "success"){
        console.error("Could not get NE map");
      }
      let doc = xhr.documentElement;
      // Give the element the following parameters
      doc.id = "ne-map";
      doc.style.width = "100%";
      doc.style.height = "100vh";
      // Put it in the container
      $("#ne-map-container").prepend(doc);
      // Check if we need to load anything more
      preload(clear_loading, ellipses_loop);
    });



    /********************************** SLIDERS ***********************************/
    /** All the functions and actions pertaining to loading the website properly **/
    /******************************************************************************/

    // Create the javascript object templates without id's from DOM templates
    let active =  $("#active_slider_template");
    let inactive = $("#inactive_slider_template");
    activeSliderTemplate = active.clone();
    inactiveSliderTemplate = inactive.clone();
    activeSliderTemplate.removeAttr("id");
    inactiveSliderTemplate.removeAttr("id");
    // Remove the old templates from the DOM
    active.remove();
    inactive.remove();
    // Update the model's slider container and selector
    sliderContainer = $("#statistics-sliders");
    selectionContainer = $("#statistics-selector");

    //Gets list of categories and creates those sliders
    $.get("/api/cats", "", function(data, status, res){
      if (status !== "success"){
        console.error("Failed to retrieve categories");
      } else {
        for (let cat of data){
          cat.title = cat.stat_name_short;
          new Stat(cat, DEFAULT_WEIGHT);
        }
        restoreFromStorage();
      }
    });



    /********************************** MAP-ACTIONS **********************************/
    /** All the functions and listeners pertaining to doing something with the maps **/
    /*********************************************************************************/

    function setUpHovering() {
        var us_map = document.getElementById("us-map");
        // Get one of the SVG items by ID;
        var us_map_top_element = $("#AK", us_map);
        // When mousing over a state
        $("path", us_map).mouseenter( function() {
            // Put it on top
            $(this).insertAfter(us_map_top_element);
            us_map_top_element = $(this);
            // Set styling
            $(this).css("filter", "contrast(85%) brightness(115%)").css("stroke-width", "3");
            // Return the styling on leaving
        }).mouseleave( function() {
            $(this).css("filter", "brightness(100%) contrast(100%)").css("stroke-width", "1");
        });
        // Done now for the NE
        var ne_map = document.getElementById("ne-map");
        var ne_map_top_element = $("#ME", ne_map);
        $("path", ne_map).mouseenter( function() {
            // Put it on top
            $(this).insertAfter(ne_map_top_element);
            ne_map_top_element = $(this);
            // Set styling
            $(this).css("filter", "contrast(85%) brightness(115%)").css("stroke-width", "3");
            // Return the styling on leaving
        }).mouseleave( function() {
            $(this).css("filter", "brightness(100%) contrast(100%)").css("stroke-width", "1");
        });
    }

    // Handle opening and closing of the NE magnifier
    $("#ne-inspector").click(function() {
        $("#ne-magnifier").css("display", "grid");
        $("#ne-inspector").css("display", "none");
        $("#us-map").addClass("blurred");
    });

    $("#ne-magnifiyer-close").click(function() {
        $("#ne-magnifier").css("display", "none");
        $("#ne-inspector").css("display", "block");
        $("#us-map").removeClass("blurred");
    });



    /*************************** STATE-WINDOW ***************************/
    /** All the functions and listeners pertaining to the state window **/
    /********************************************************************/

    //blurs background and makes body unscrollable and unhides the state window
    function prepareStateWindow() {
        var us_map = document.getElementById("us-map").contentDocument;

        //when clicking on a state
        $("path", us_map).click(function () {
            for (let element of blur_elements) {
                $("#"+element).addClass("blurred");
            }
            $("body").addClass("unscrollable");
            $("#state-window-alert-container").removeClass("hidden");
        });
    }

    /**
     * @param {bool} NE true if using NE magnifier, false for mainland US
     *
     * @notes The point of this function is to reduce loading time, by loading up the information
     *      into the state window on load as opposed to on click. There may be more latency when
     *      clicking a statistic, but reasonably none when clicking on a state.
     */
    function populateStateWindow(is_ne){
        // Check if we are working with NE map or whole US map and set variables accordingly
        if(is_ne){
            map = document.getElementById("ne-map").contentDocument;
        } else {
            map = document.getElementById("us-map").contentDocument;
        }
        // When clicking on a state
        $("path", map).click(function() {
            let state_names = is_ne ? ne_state_names : us_state_names;
            fillStateWindow($(this).attr("id"), state_names);
        });
    }

    $("#metadata-alert-close").click(closeMetadataAlert);

    $(".alert-close").click(function() {
        for (let element of blur_elements) {
            $("#"+element).removeClass("blurred");
        }
        $("body").removeClass("unscrollable");
        $(".alert-container").addClass("hidden");
        $(".loading").removeClass("hidden");
    });



    /*************************** STATE-WINDOW ***************************/
    /** All the functions and listeners pertaining to the state window **/
    /********************************************************************/

    // On theme-circle click, change the active theme
    $(".theme-template").click(function() {
        // Change the circle to be "active"
        var theme_id = $(this).attr("id") + "-theme";
        $(".theme-template-active").addClass("theme-template").removeClass("theme-template-active");
        $(this).addClass("theme-template-active").removeClass("theme-template");
        // Change the stylesheet reference

        /*EXTERNAL CITATION
        Disabling style sheets:
          https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet/disabled
        Selecting stylesheets:
          https://css-tricks.com/examples/AlternateStyleSheets/ (source code)
        */

        $("link[rel~='stylesheet']").each(function(_, theme) {
            theme = $(theme);
            if(theme.hasClass("theme")){
              if(theme.attr("title") != theme_id) {
                  //$("#"+theme+"-theme").attr("rel", "alternate stylesheet");
                theme.prop("disabled", true);
              } else {
                theme.prop("disabled", false);
              }
          }
      });
        // Recolor the map
        displayWeights();
    });

    // TODO: Fix to work when about section exists.
    $("#nav-arrow").click( function() {
        $("html, body").animate({ scrollTop: $(window).height() }, 1000);
    });

    // $(window).scroll( function() {
    //     let scroll_val = Math.floor($(window).scrollTop());
    //     if(window.performance.now() - lastMove > 33) {
    //         $("#settings").css("left", -1*scroll_val);
    //         var height = $(window).height();
    //         var map_opacity = (height - scroll_val*1.5) / height;
    //         $("#map-container").css("filter", "opacity(" + map_opacity + ")");
    //         $("#map-legend-container").css("filter", "opacity(" + map_opacity + ")");
    //         lastMove = window.performance.now();
    //     }
    // });
});

function fillStateWindow(state_id, state_names) {
    // Get the state's id, and write the name in the window
    var state_name = state_names[state_id];
    $("#state-name").text(state_name);

    // Update the chart
    drawChart(state_id, data.weights, data.ranks);

    // Make array of stats organized by state's ranking in each statistic
    let stateCatArr = getStateInfo(state_id);

    // rank is the overall rank of the state based on selected stats
    let rank = data.ranks.indexOf(state_id) + 1;
    // Write the rank to the DOM
    $("#state-rank").text("State Rank: " + rank);

    // Get and display the appropriate state png
    $("#state-display").html(
        "<img src=\"images/us_states/"+state_id+".png\" alt=\""+state_name+
        "\" class=\"state-window-image\" />"
    );
    // If no stats are selected
    if (stateCatArr.length == 0) {
        // Hide the bottom row and right column
        $("#bad-stats").css("display", "none");
        $("#bad-stats-details").css("display", "none");
        $("#good-stats-details").css("display", "none");
        // Make the good_stats area the size of the whole container
        $("#state-window-data-container").css("grid-template-rows", "100% 0%")
            .css("grid-template-columns", "100% 0%");
        // Write message to state_rank area
        $("#state-rank").text("State Rank: N/A");
        // Clear good-stats-details
        $("#good-stats-details").html("");
        // Display error message about not selecting any stats
        let errMsgNoStats = "You have not selected any statisics to rank this state.<br><br>"+
            "Please click close and select a statisitic from the Available Statistics category";
        $("#good-stats").html("<b>" + errMsgNoStats + "</b>");
        // Hide the chart
        $("#myChart").css("visibility", "hidden");
    // if only one stat is selected
    } else if (stateCatArr.length == 1) {
        // The best stat for the selected state is the first one in the stateCatArr
        // Get the stat from global var data by "id"
        let best_stat = data.stats[stateCatArr[0]["id"]];
        // Hide bottom row
        $("#bad-stats").css("display","none");
        $("#bad-stats-details").css("display", "none");
        $("#good-stats-details").css("display", "block");
        // Set first row to take up whole grid area, show both columns
        $("#state-window-data-container").css("grid-template-rows", "100% 0%")
            .css("grid-template-columns", "50% 50%");
        // Write message about having only 1 stat selected, so there is no worst stat
        let msgOneStat = "<i>(You have only selected one statisic ranking this state.)</i><br>";
        $("#good-stats").html(msgOneStat);

        // Write the best_stat name to the DOM
        $("#good-stats").append("<h3>Selected statistic:</h3>" + best_stat.category.stat_name_short + "\n");
        populateDataDetails(best_stat, true);

        // Show chart
        $("#myChart").css("visibility", "visible");
    } else {
        // Retrieve the best and worst stats from the global variable data based on id
        let best_stat = data.stats[stateCatArr[0]["id"]];
        let worst_stat = data.stats[stateCatArr[stateCatArr.length - 1]["id"]];

        // Show all 4 grid areas
        $("#bad-stats").css("display", "block");
        $("#bad-stats-details").css("display", "block");
        $("#good-stats-details").css("display", "block");

        // Show both rows and both columns
        $("#state-window-data-container").css("grid-template-rows", "50% 50%");
        $("#state-window-data-container").css("grid-template-columns", "50% 50%");

        // Write good/bad stat names in good/bad grid items
        $("#good-stats").html("<h3>Best statistic:</h3>\n " + best_stat.category.stat_name_short + "\n");
        $("#bad-stats").html("<h3>Worst statistic:</h3>\n " + worst_stat.category.stat_name_short + "\n");

        // Write details/metadata in good/bad stats details grid items
        $("#good-stats-details").text("");
        $("#bad-stats-details").text("");
        populateDataDetails(best_stat, true);
        populateDataDetails(worst_stat, false);

        // Show the graph
        $("#graph").css("display", "block");
    }
}

/**
* @param stat stat object to write details about
* @param best bool, whether the stat is the best or the worst
*/
function populateDataDetails(stat, best) {
    let msg = "msg";
    if (best) $("#good-stats-details").html("<h3>Statistic Details:</h3>");
    else $("#bad-stats-details").html("<h3>Statistic Details</h3>:");
    if (stat.metadata) {
        msg = createDetailsMsg(stat);
        if(best) $("#good-stats-details").append(msg);
        else $("#bad-stats-details").append(msg);
    } else if (!data.metadataFetched) {
        let promise = getMetadata();
        promise.then((metadata) => {
            data.metadataFetched = true;
            if (metadata !== null) {
                setMetadata(metadata);
                if (stat.metadata !== undefined) {
                    msg = createDetailsMsg(stat);
                    if (best) $("#good-stats-details").append(msg);
                    else $("#bad-stats-details").append(msg)
                }
            }
        });
    } else {
        console.error("Unknown error while populating Statistic Details");
    }
}

/**
* @param {Stat} stat Stat to create message about
* @returns {msg} message about stat
*/
function createDetailsMsg(stat){
    let survey_period = stat.metadata.survey_period;
    let source = stat.metadata.source;
    let units = stat.data.units;
    let note = stat.metadata.note;

    let msg = "Survey period: " + survey_period +
    "<br>Source: " + source;

    if (note !== "" && note !== "n.a.") {
        msg = msg + "<br>Note: " + note;
    }
    return msg;
}

async function getMetadata(){
  let metadata = await $.get("/api/meta").catch((err) => {return null;});
  return metadata;
}

// Make body unscrollable, blur background and show metadata alert
function prepareMetadataAlert(){
  $("body").addClass("unscrollable");
  for (var element of blur_elements) {
      $("#"+element).addClass("blurred");
  }
  $("#metadata-alert-container").removeClass("hidden");
}

/**
 * @param metadata - the metadata object returned from the server. Must have at least
 *      the following:
 *          state_name_short, publication_date, note, source, original_source
 */
function showMetadataAlert(metadata){
  let container = $("#metadata-alert-container");
  $("#metadata-title").text(metadata.stat_name_short);
  $("#metadata-date").text(metadata.publication_date);
  $("#metadata-notes").text(metadata.note);
  $("#metadata-publisher").text(metadata.source + ": " + metadata.original_source);
  $(".loading").addClass("hidden");
  $(".metadata-alert-element").removeClass("hidden");
}

// Unblurs the background, makes background scrollable, shows loading, hides metadata alert
function closeMetadataAlert() {
  for (var element of blur_elements) {
      $("#"+element).removeClass("blurred");
  }
  $("body").removeClass("unscrollable");
  $(".loading").removeClass("hidden");
  $(".metadata-alert-element").addClass("hidden");
  $("#metadata-alert-container").addClass("hidden");
}

// Creates an active slider from the template and adds it to the page
function makeActiveSlider(title, weight){
  let slider = activeSliderTemplate.clone();
  $(".statistic-slider", slider).attr("value", weight);
  $(".statistic-slider-title", slider).html(title);
  sliderContainer.append(slider);
  return slider;
}

// Creates an inactive slider from the template and adds it to the page
function makeInactiveSlider(title){
  let slider = inactiveSliderTemplate.clone();
  $(".statistic-option-title", slider).html(title);
  selectionContainer.append(slider);
  return slider;
}

/**
 * @param weight number between 0 and 1 representing how "colored" the color should be
        //0 is low, 1 is high
 * @param color is the color to be mixed with the light color
 * @return is the resulting rgba string that can be used in the website
 */
function mixColor(weight, color) {
    // Get the theme colors
    var min_string = $(":root").css("--color-light");
    var max_string = $(":root").css(color);
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

function colorSVG(doc, state, weight) {
    // Get one of the SVG items by ID;
    var svgItem = doc.getElementById(state);
    // Set the color to something else
    var border = $(":root").css("--secondary-color-dark");
    svgItem.setAttribute("style", "stroke-width: 1; stroke: "+border+"; fill: "+mixColor(weight, "--accent-color")+";");
}

function colorState(state, weight) {
    let us_map = document.getElementById("us-map");
    let ne_map = document.getElementById("ne-map");

    colorSVG(us_map, state, weight);
    if(ne_states.includes(state)) {
        colorSVG(ne_map, state, weight);
    }
}

//weights is the dictionary with keys of state abbreviations and values of the calculated weight
//ranks is an array, with only state abbreviations, from best to worst
function drawChart(state_id, weights, ranks) {
    var ctx = document.getElementById('myChart').getContext('2d');

    ctx.canvas.width = $("#graph").width();
    ctx.canvas.height = $("#graph").height();

    //this prevents the charts from stacking and interfering with eachother
    if (chart != undefined){
        chart.destroy();
    }

    let tooltip_color = getComputedStyle(document.documentElement).getPropertyValue('--color-dark');
    let tooltip_text = getComputedStyle(document.documentElement).getPropertyValue('--color-light');
    let select_color = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color-light');
    let select_hover = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color-dark');
    let select_border_color = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color-dark');
    let regular_border_color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color-dark');

    let bar_color_array = [];
    let bar_hover_array = [];
    let border_color_array = [];

    for (var idx = 0; idx < ranks.length; idx++) {
        if(ranks[idx] === state_id) {
            bar_color_array.push(select_color);
            bar_hover_array.push(select_hover);
            border_color_array.push(select_border_color);
        } else {
            bar_color_array.push(mixColor(weights[ranks[idx]], "--accent-color"));
            bar_hover_array.push(mixColor(weights[ranks[idx]], "--accent-color-light"));
            border_color_array.push(regular_border_color);
        }
    }

    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: {
            labels: ranks,
            datasets: [{
                label: "",
                backgroundColor: bar_color_array,
                borderColor: border_color_array,
                borderWidth: 2,
                hoverBackgroundColor: bar_hover_array,
                hoverBorderColor: border_color_array,
                data: ranks.map( x => (100*weights[x]).toFixed(4)) //javascript is nice and has a mapping function that eliminates the need to loop
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                yAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)"
                    },
                    ticks: {
                        display: false
                    }
                }],
                xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)"
                    },
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                titleFontSize: 16,
                caretSize: 8,
                displayColors: false,
                footerFontSize: 14,
                titleAlign: "center",
                backgroundColor: tooltip_color,
                bodyFontColor: tooltip_text,
                titleFontColor: tooltip_text
            },
            animation: {
                duration: 100
            }
        }
    });
}
