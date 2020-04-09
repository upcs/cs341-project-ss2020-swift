'use strict';

function setLayout(){
    let aspect_ratio = $(window).width() / $(window).height();
    if(aspect_ratio < 1) {
        console.log(aspect_ratio);
        $("#horizontal-layout").prop("disabled", true);
        $("#vertical-layout").prop("disabled", false);
    } else {
        console.log(aspect_ratio);
        $("#vertical-layout").prop("disabled", true);
        $("#horizontal-layout").prop("disabled", false);
    }
}

$(document).ready(function(){
    setLayout();
    var resizeTimer;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setLayout, 100);
    });
});
