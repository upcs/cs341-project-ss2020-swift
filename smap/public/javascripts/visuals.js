'use strict';

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

    function preload(callback, loop) {
        $("#model").css("display", "none");
        let us_map_document = $("#us-map").length;
        let ne_map_document = $("#ne-map").length;
        if (us_map_document === 0 || ne_map_document === 0){
          return;
        }
        setupHovering();
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
    }, 1750 );

    $.get("/images/us.svg", "", function(xhr, status, res){
      if (status !== "success"){
        console.error("Could not get US map");
      }
      let doc = xhr.documentElement;
      doc.id = "us-map";
      doc.style.width = "100%";
      doc.style.height = "100%";
      $("#map-container").append(doc);
      preload(clear_loading, ellipses_loop);
    });

    $.get("/images/ne.svg", "", function(xhr, status, res){
      if (status !== "success"){
        console.error("Could not get NE map");
      }
      let doc = xhr.documentElement;
      doc.id = "ne-map";
      doc.style.width = "100%";
      doc.style.height = "100%";
      $("#ne-map-container").prepend(doc);
      preload(clear_loading, ellipses_loop);
    });

    function setupHovering() {
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


    // The inital top element
    // Get the svg document content


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

        /*EXTERNAL CITATION
        Disabling style sheets:
          https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet/disabled
        Selecting stylesheets:
          https://css-tricks.com/examples/AlternateStyleSheets/ (source code)
        */
        $("#"+theme_id+"-theme").prop("disabled", false);
        for(let theme of themes) {
            if(theme != theme_id) {
                $("#"+theme+"-theme").prop("disabled", true);
            }
        };
        // Recolor the map
        displayWeights();
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
            var height = $(window).height();
            var map_opacity = (height - scroll_val*1.5) / height;
            $("#map-container").css("filter", "opacity(" + map_opacity + ")");
            $("#map-legend-container").css("filter", "opacity(" + map_opacity + ")");
            lastMove = window.performance.now();
        }
    });
});

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
    // Set the color to something else
    var border = $(":root").css("--secondary-color-dark");
    svgItem.setAttribute("style", "stroke-width: 1; stroke: "+border+"; fill: "+mixColor(weight)+";");
}

function colorState(state, weight) {
    const ne_states = ["MA", "CT", "NH", "RI", "VT", "DE", "MD", "MJ", "NY", "PA", "ME", "NJ"];
    let us_map = document.getElementById("us-map");
    let ne_map = document.getElementById("ne-map");

    colorSVG(us_map, state, weight);
    if(ne_states.includes(state)) {
        colorSVG(ne_map, state, weight);
    }

}
