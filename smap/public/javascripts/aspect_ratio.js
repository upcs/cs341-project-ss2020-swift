'use strict';

const MIN_WIDTH = 500;
const MIN_HEIGHT = 500;
const MIN_HORIZONTAL_WIDTH = 1000;
const CRITICAL_ASPECT_RATIO = 1.125;
const LAYOUT_CHANGE_TIME = 125;

var orientation = null;

/**
 * @param {Boolean} init this variable says if the color flash should happen
 * @notes this function changes the stylesheet if the aspect ratio is closer to vertical, or if the
 *      horizontal width of the window is too small to allow for good sidebar usage
 */
function setLayout(init){
    if($(window).height() < MIN_HEIGHT || $(window).width() < MIN_WIDTH) {
        console.error("Too small window size");
        $("#error").css("display", "grid");
    } else {
        $("#error").css("display", "none");
        let aspect_ratio = $(window).width() / $(window).height();
        if(aspect_ratio < CRITICAL_ASPECT_RATIO || $(window).width() < MIN_HORIZONTAL_WIDTH) {
            if(orientation !== "vertical") {
                orientation = "vertical";
                if(!init) { $("body").animate({opacity: "0"}, LAYOUT_CHANGE_TIME, "swing"); }
                window.setTimeout(function() {
                    $("#horizontal-layout").prop("disabled", true);
                    $("#vertical-layout").prop("disabled", false);
                }, LAYOUT_CHANGE_TIME);
                if(!init) { $("body").animate({opacity: "1"}, LAYOUT_CHANGE_TIME, "swing"); }
            }
        } else {
            if(orientation !== "horizontal") {
                orientation = "horizontal";
                if(!init) { $("body").animate({opacity: "0"}, LAYOUT_CHANGE_TIME, "swing"); }
                window.setTimeout(function() {
                    $("#vertical-layout").prop("disabled", true);
                    $("#horizontal-layout").prop("disabled", false);
                }, LAYOUT_CHANGE_TIME);
                if(!init) { $("body").animate({opacity: "1"}, LAYOUT_CHANGE_TIME, "swing"); }
            }
        }
    }
}

$(document).ready(function(){
    setLayout(true);
    var resizeTimer;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { setLayout(false) }, 100);
    });
});
