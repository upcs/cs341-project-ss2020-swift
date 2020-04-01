'use strict';

const blur_elements = [
    $("#nav-bar"), $("#settings"), $("#map-container"), $("#about-container")
];

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
        })
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

    //adds state specific 
    function populateStateWindow(metadata){
        var us_map = document.getElementById("us-map").contentDocument;
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

        //when clicking on a state
        $("path", us_map).click(function () {

            var state_id = $(this).attr("id");
            var state_name = state_names[state_id];

            $("#state-name").text(state_name);
            let stateCatArr = getStateInfo(state_id);

            let best_stat = data.stats[stateCatArr[0]["id"]];
            let worst_stat = data.stats[stateCatArr[stateCatArr.length - 1]["id"]]; 

            $("#good-stats").text("Best stat:\n " + best_stat.category.stat_name_short + "\n");
            
            $("#bad-stats").text("Worst stat:\n " + worst_stat.category.stat_name_short + "\n");

                  
            $("#good-stats-details").text("Hello darkness my old friend "); 

            // for(int i=0; i<2; i++) {
            //     var stat;
            //     switch (i):
            //         case 0:
            //             stat = best_stat;
            //             break;
            //         case 1:
            //             stat = worst_stat;
            //             break; 
            // }
            
            console.log("best stat: " + JSON.stringify(best_stat)); 
            
            if(best_stat.metadata){
                $("good-stats-details").append(best_stat.metadata.publication_date); 
            } else if(!data.metadataFetched) {
                let promise = getMetadata();
                promise.then((metadata) => {
                    data.metadataFetched = true;                    
                    if (metadata !== null) {
                        setMetadata(metadata);
                        if (best_stat.metadata !== undefined) {
                            console.log("best stat.metadata: " + JSON.stringify(best_stat.metadata)); 
                            let survey_period = best_stat.metadata.survey_period; 
                            let source = best_stat.metadata.source; 
                            let publisher = best_stat.metadata.publisher; 
                            let units = best_stat.data.units; 
                            let note = best_stat.metadata.note; 

                            let msg = "Survey period: " + survey_period +
                                "<br>Source: " + source + 
                                "<br>Publisher: " + publisher + 
                                "<br>Units: " + "..." + 
                                "<br>Note: " + note;

                            $("#good-stats-details").html(msg);
                            // $("#good-stats-details").html("line1 <br>line2\nline3"); 
                            
                        }
                    }
                });
            } else {
                console.error("<visuals><populateStateWindow>: Unknown error")
            }
            
            //TODO: handle when only 0 or 1 stat is selected 

        });
    }

    /*
        Of the statistics you selected, *state_name* is ranked the best in *title*

        *state_name* is ranked *rank* of all 50 states in terms of *title*.

        Survey period: *survey_period*
        Source: *source*
        Published by: *published_by*
        Units:

        \nNote: *note*
    */ 
        
    /////////////////////////////////
    /////////REFERENCE///////////////
    /////////////////////////////////
    // function showMetadataAlert(metadata) {
    //     let container = $("#metadata-alert-container");
    //     $("#metadata-title").text(metadata.stat_name_short);
    //     $("#metadata-date").text(metadata.publication_date);
    //     $("#metadata-notes").text(metadata.note);
    //     $("#metadata-publisher").text(metadata.source + ": " + metadata.original_source);
    //     $(".loading").addClass("hidden");
    //     $(".metadata-alert-element").removeClass("hidden");
    // }

    const blur_elements = [
        $("#nav-bar"), $("#settings"), $("#map-container"), $("#about-container"), $("#ne-inspector-container")
    ];

    // The inital top element
    // Get the svg document content
    window.setTimeout(function() {
        setUpNEMagnifier();
        setUpStateHovering();
        prepareStateWindow();
        populateStateWindow(); //when a state is clicked
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
        var theme_id = $(this).attr("id");
        $(".theme-template-active").addClass("theme-template").removeClass("theme-template-active");
        $(this).addClass("theme-template-active").removeClass("theme-template");
        // Change the stylesheet reference
        $("#"+theme_id+"-theme").attr("rel", "stylesheet");
        for(let theme of themes) {
            if(theme != theme_id) {
                $("#"+theme+"-theme").attr("rel", "alternate stylesheet");
            }
        }
        // Recolor the map
        window.setTimeout(function() { displayWeights(); } , 50);
        // displayWeights();
    });

    // Scrolling effects
    var lastMove = 0;
    // TODO: Fix to work when about section exists.
    $("#nav-arrow").click( function() {
        $("html, body").animate({ scrollTop: 789 }, 1000);
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
function mixColor(weight) {
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

function colorSVG(doc, state, weight) {
    // Get one of the SVG items by ID;
    var svgItem = doc.getElementById(state);
    // Set the colour to something else
    var border = $(":root").css("--secondary-color-dark");
    svgItem.setAttribute("style", "stroke-width: 1; stroke: "+border+"; fill: "+mixColor(weight)+";");
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
