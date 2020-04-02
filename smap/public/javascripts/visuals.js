'use strict';

const blur_elements = [
    $("#nav-bar"), $("#settings"), $("#map-container"), $("#about-container")
];

var chart;

$("document").ready(function () {
    //////////////////////
    // START ANIMATION //
    function clear_loading(loop) {
        window.setTimeout(function() {
            clearInterval(loop);
        }, 500);
        $("#dot1").animate({opacity: "0"}, 500, "swing");
        $("#dot2").animate({opacity: "0"}, 500, "swing");
        $("#dot3").animate({opacity: "0"}, 500, "swing");
        window.setTimeout(function() {
            $("#ellipses").slideUp(1000);
            $("#loading").animate({opacity: "0"}, 500);
            $("#orange-red").click();
            window.setTimeout(function() { $("#loading").html("Ready!"); }, 500 );
            $("#loading").animate({opacity: "1", fontSize: "50px"}, 500);
            window.setTimeout(function() {
                $("#init").css("pointer-events","none");
                $("#init").animate({opacity: "0"}, 500);
                $("#loading").animate({fontSize: "100px"}, 400);
            }, 1500 );
        }, 1000);
        // Print load
        let load_time = (window.performance.now() / 1000);
        console.log("Page load time: " + load_time + "s");
        console.log("Time until page operable: "+ (load_time+2.5) +"s");
    }
    function load_themes(callback, loop) {
        const themes = [
            "orange-red-theme", "green-blue-theme", "pink-purple-theme",
            "dark-red-theme", "dark-green-theme", "dark-blue-theme"
        ];
        for(var i = 0; i < themes.length; i++) {
            if(i !== themes.length - 1) {
                $("#"+themes[i+1]).attr("rel", "stylesheet");
                $("#"+themes[i]).attr("rel", "alternate stylesheet")
            } else {
                $("#"+themes[0]).attr("rel", "stylesheet");
                $("#"+themes[i]).attr("rel", "alternate stylesheet")
            }
        }
        callback(loop);
    }
    var ellipses_loop = setInterval(function() {
        var dot1 = $("#dot1");
        var dot2 = $("#dot2");
        var dot3 = $("#dot3");
        dot1.animate({opacity: "0", fontSize: "60px"}, 500, "swing");
        dot1.animate({opacity: "1", fontSize: "80px"}, 500, "swing");
        window.setTimeout(function() {
            dot2.animate({opacity: "0", fontSize: "60px"}, 500, "swing");
            dot2.animate({opacity: "1", fontSize: "80px"}, 500, "swing");
            window.setTimeout(function() {
                dot3.animate({opacity: "0", fontSize: "60px"}, 500, "swing");
                dot3.animate({opacity: "1", fontSize: "80px"}, 500, "swing");
            }, 250);
        }, 250);
    }, 1000 );
    load_themes(clear_loading, ellipses_loop);

    // END ANIMATIONS //
    ////////////////////

    let active =  $("#active_slider_template");
    activeSliderTemplate = active.clone();
    activeSliderTemplate.removeAttr("id");
    active.remove();

    let inactive = $("#inactive_slider_template");
    inactiveSliderTemplate = inactive.clone();
    inactiveSliderTemplate.removeAttr("id");
    inactive.remove();

    sliderContainer = $("#statistics-sliders");
    selectionContainer = $("#statistics-selector");
    map = $("#us-map");

    // Get the model
    var model = document.getElementById("model");

    // Get the image and insert it inside the model - use its "alt" text as a caption
    var img = document.getElementById("ne-inspector");
    img.onclick = function(){
        model.style.display = "grid";
    }

    // Get the <span> element that closes the model
    var span = document.getElementById("ne-magnifiyer-close");

    // When the user clicks on <span> (x), close the model
    span.onclick = function() {
        model.style.display = "none";
    }

    //Gets list of categories and creates those sliders
    $.get("/api/cats", "", function(data, status, res){
      if (status !== "success"){
        console.log("[!] Error getting categories");
      } else {
        for (let cat of data){
          cat.title = cat.stat_name_short;
          new Stat(cat, DEFAULT_WEIGHT);
        }
        restoreFromStorage();
      }
    });

    //Gets metadata information and populates the windows
    // $.get("/api/meta", "", function(data, status, res){
    //     if (status !== "success"){
    //       console.log("Error getting metadata");
    //       alert("AHHHH no metadata");
    //     } else {
    //         alert(data[1].published_by + " " + data[0].published_by);
    //     //   for (let cat of data){
    //     //     cat.title = cat.stat_name_short;
    //     //     new Stat(cat, DEFAULT_WEIGHT);
    //     //   }
    //     }
    //   });


    //all the neMagnifier js I can find
    function setUpNEMagnifier(){
        var ne_map = document.getElementById("ne-map").contentDocument;
        var ne_map_top_element = $("#ME", ne_map);
        $("path", ne_map).mouseenter(function () {
            // Put it on top
            $(this).insertAfter(ne_map_top_element);
            ne_map_top_element = $(this);
            // Set styling
            $(this).css("filter", "contrast(85%) brightness(115%)").css("stroke-width", "3");
            // Return the styling on leaving
        }).mouseleave(function () {
            $(this).css("filter", "brightness(100%) contrast(100%)").css("stroke-width", "1");
        }).click(function () {
            for (let element of blur_elements) {
                element.addClass("blurred");
            }
            $("body").addClass("unscrollable");
            $("#state-window-alert-container").removeClass("hidden");
        });
    }

    //sets up event listeners for state hovering
    function setUpStateHovering(){
        var us_map = document.getElementById("us-map").contentDocument;
        // Get one of the SVG items by ID;
        var us_map_top_element = $("#AK", us_map);
        // When mousing over a state
        $("path", us_map).mouseenter(function () {
            // Put it on top
            $(this).insertAfter(us_map_top_element);
            us_map_top_element = $(this);
            // Set styling
            $(this).css("filter", "contrast(85%) brightness(115%)").css("stroke-width", "3");
            // Return the styling on leaving
        }).mouseleave(function () {
            $(this).css("filter", "brightness(100%) contrast(100%)").css("stroke-width", "1");
        });
    }

    //blurs background and makes body unscrollable and unhides the state window
    function prepareStateWindow() {
        var us_map = document.getElementById("us-map").contentDocument;

        //when clicking on a state
        $("path", us_map).click(function () {
            for (let element of blur_elements) {
                element.addClass("blurred");
            }
            $("body").addClass("unscrollable");
            $("#state-window-alert-container").removeClass("hidden");
        });
    }

    //adds state specific details
    function populateStateWindow(NE){
        if(NE){
            var map = document.getElementById("ne-map").contentDocument;
            var state_names = {
                CT: "Connecticut",
                DE: "Deleware",
                ME: "Maine",
                MD: "Maryland",
                MA: "Massachusetts",
                NH: "New Hampshire",
                NJ: "New Jersey",
                NY: "New York",
                PA: "Pennsylvania",
                RI: "Rhode Island",
                VT: "Vermont"
            }
        }
        else {
            var map = document.getElementById("us-map").contentDocument;
            var state_names = {
                AL: "Alabama",
                AK: "Alaska",
                AZ: "Arizona",
                AR: "Arkansas",
                CA: "California",
                CO: "Colorado",
                CT: "Connecticut",
                DE: "Deleware",
                FL: "Florida",
                GA: "Georgia",
                HI: "Hawaii",
                ID: "Idaho",
                IL: "Illinois",
                IN: "Indiana",
                IA: "Iowa",
                KS: "Kansas",
                KY: "Kentucky",
                LA: "Louisiana",
                ME: "Maine",
                MD: "Maryland",
                MA: "Massachusetts",
                MI: "Michigan",
                MN: "Minnesota",
                MS: "Mississippi",
                MO: "Missouri",
                MT: "Montana",
                NE: "Nebraska",
                NV: "Nevada",
                NH: "New Hampshire",
                NJ: "New Jersey",
                NM: "New Mexico",
                NY: "New York",
                NC: "North Carolina",
                ND: "North Dakota",
                OH: "Ohio",
                OK: "Oklahoma",
                OR: "Oregon",
                PA: "Pennsylvania",
                RI: "Rhode Island",
                SC: "South Carolina",
                SD: "South Dakota",
                TN: "Tennessee",
                TX: "Texas",
                UT: "Utah",
                VT: "Vermont",
                VA: "Virginia",
                WA: "Washington",
                WV: "West Virginia",
                WI: "Wisconson",
                WY: "Wyoming"
            };
        }

        //when clicking on a state
        $("path", map).click(function () {

            //get the state's id, and write the name in the window
            var state_id = $(this).attr("id")
            var state_name = state_names[state_id];
            $("#state-name").text(state_name);

            // Update the chart
            drawChart(state_id, data.weights, data.ranks);

            //make array of stats organized by state's ranking in each statistic
            let stateCatArr = getStateInfo(state_id);

            let rank = data.ranks.indexOf(state_id) + 1;
            $("#state-rank").text("State Rank: " + rank);

            //retrieve the best and worst stats from the global variable data based on id

            $("#state-display").html("<img src=\"images/us_states/"+state_id+".png\" alt=\""+state_name+"\" class=\"state-window-image\" />");

            if (stateCatArr.length == 0) {
                $("#bad-stats").css("display", "none");
                $("#bad-stats-details").css("display", "none");
                $("#good-stats-details").css("display", "none");

                $("#state-rank").text("State Rank: *no statistics selected*");

                let errMsgNoStats = "You have not selected any statisics to rank this state. <br><br>Please click close and select a statisitic from the Statistic Selection category";
                $("#good-stats").html(errMsgNoStats);
                $("#state-window-data-container").css("grid-template-rows", "100% 0%");
            } else if (stateCatArr.length == 1){
                let best_stat = data.stats[stateCatArr[0]["id"]];

                $("#bad-stats").css("display","none");
                $("#bad-stats-details").css("display", "none");
                $("#good-stats-details").css("display", "block");

                let msgOneStat = "<i>(You have only selected one statisic to rank this state by.)</i><br>";
                $("#good-stats").html(msgOneStat);

                $("#good-stats").append("<h3>Selected statistic:</h3>" + best_stat.category.stat_name_short + "\n");
                populateDataDetails(best_stat, true);

                $("#state-window-data-container").css("grid-template-rows", "100% 0%");
            } else {
                let best_stat = data.stats[stateCatArr[0]["id"]];
                let worst_stat = data.stats[stateCatArr[stateCatArr.length - 1]["id"]];

                $("#bad-stats").css("display", "block");
                $("#bad-stats-details").css("display", "block");
                $("#good-stats-details").css("display", "block");

                //write good/bad stat names in good/bad grid items
                $("#good-stats").html("<h3>Best statistic:</h3>\n " + best_stat.category.stat_name_short + "\n");
                $("#bad-stats").html("<h3>Worst statistic:</h3>\n " + worst_stat.category.stat_name_short + "\n");

                //write details/metadata in good/bad stats details grid items
                $("#good-stats-details").text("");
                $("#bad-stats-details").text("");
                populateDataDetails(best_stat, true);
                populateDataDetails(worst_stat, false);
                $("#state-window-data-container").css("grid-template-rows", "50% 50%");
            }
        });
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
        console.error("<visuals><populateStateWindow>: Unknown error")
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

    const blur_elements = [
        $("#nav-bar"), $("#settings"), $("#map-container"), $("#about-container"), $("#ne-inspector-container")
    ];

    // The inital top element
    // Get the svg document content
    window.setTimeout(function() {
        setUpNEMagnifier();
        setUpStateHovering();
        prepareStateWindow();
        populateStateWindow(true); //NE is true
        populateStateWindow(false); //NE is false
    }, 250);

    $(".alert-close").click( () =>
        closeAlert()
    );

    function closeAlert() {
        for (let element of blur_elements) {
            element.removeClass("blurred");
        }
        $("body").removeClass("unscrollable");
        $(".alert-container").addClass("hidden");
        $(".loading").removeClass("hidden");
    }

    // On theme-circle click, change the active theme
    $(".theme-template").click( function() {
        const themes = [
            "orange-red", "green-blue", "pink-purple", "dark-red", "dark-green", "dark-blue"
        ];
        // Change the circle to be "active"
        var theme_id = $(this).attr("id") + "-theme";
        $(".theme-template-active").addClass("theme-template").removeClass("theme-template-active");
        $(this).addClass("theme-template-active").removeClass("theme-template");
        // Change the stylesheet reference
        //$("#"+theme_id+"-theme").attr("rel", "stylesheet");

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
                theme.prop("disabled", true);
              } else {
                console.log("Enabling stylesheet");
                theme.prop("disabled", false);
              }
            }
        });
        // Recolor the map
        displayWeights();
        // displayWeights();
    });

    // Scrolling effects
    var lastMove = 0;
    // TODO: Fix to work when about section exists.
    $("#nav-arrow").click( function() {
        $("html, body").animate({ scrollTop: $(window).height() }, 1000);
    });

    $(window).scroll( function() {
        let scroll_val = Math.floor($(window).scrollTop());
        if(window.performance.now() - lastMove > 33) {
            $("#settings").css("left", -1*scroll_val);
            $("#map-container").css("filter", "opacity(" + ((550 - scroll_val) / 350) + ")");
            $("#map-legend-container").css("filter", "opacity(" + ((550 - scroll_val) / 350) + ")");
            lastMove = window.performance.now();
        }
    });

    $("#metadata-alert-close").click(closeMetadataAlert);
});

async function getMetadata(){
  let metadata = await $.get("/api/meta", (data, status, xhr) => {
    if (status !== "success"){
      console.error("Unable to query for metadata");
      return null;
    } else {
      return data;
    }
  });
  return metadata;
}

function prepareMetadataAlert(){
  $("body").addClass("unscrollable");
  for (var element of blur_elements) {
      element.addClass("blurred");
  }
  $("#metadata-alert-container").removeClass("hidden");
}

/*
  Args:
    metadata - the metadata object returned from the server. Must have at least
    the following:
        state_name_short, publication_date, note, source, original_source
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

function closeMetadataAlert(){
  for (var element of blur_elements) {
      element.removeClass("blurred");
  }
  $("body").removeClass("unscrollable");
  $(".loading").removeClass("hidden");
  $(".metadata-alert-element").addClass("hidden");
  $("#metadata-alert-container").addClass("hidden");
}

//Creates an active slider from the template and adds it to the page
function makeActiveSlider(title, weight){
  let slider = activeSliderTemplate.clone();
  $(".statistic-slider", slider).attr("value", weight);
  $(".statistic-slider-title", slider).html(title);
  sliderContainer.append(slider);
  return slider;
}

//Creates an inactive slider from the template and adds it to the page
function makeInactiveSlider(title){
  let slider = inactiveSliderTemplate.clone();
  $(".statistic-option-title", slider).html(title);
  selectionContainer.append(slider);
  return slider;
}

// Weight is a value between 0 and 1
// 0 is low, 1 is high
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
    // Set the colour to something else
    var border = $(":root").css("--secondary-color-dark");
    svgItem.setAttribute("style", "stroke-width: 1; stroke: "+border+"; fill: "+mixColor(weight, "--accent-color")+";");
}

function colorState(state, weight) {
    const ne_states = ["MA", "CT", "NH", "RI", "VT", "DE", "MD", "MJ", "NY", "PA", "ME", "NJ"];
    // Get the svg
    var us_map = document.getElementById("us-map").contentDocument;
    // If it exists
    $(us_map).ready(colorSVG(us_map, state, weight));
    // If the state in question is also in the NE, do the same for the separate SVG
    if(ne_states.includes(state)) {
        var ne_map = document.getElementById("ne-map").contentDocument;
        $(ne_map).ready(colorSVG(ne_map, state, weight));
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
