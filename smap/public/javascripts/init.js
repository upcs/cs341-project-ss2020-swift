'use strict';
$("document").ready(function () {
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
            window.setTimeout(function() { $("#loading").html("Ready!"); }, 500 );
            $("#loading").animate({opacity: "1", fontSize: "50px"}, 500);
            window.setTimeout(function() {
                $("#init").css("pointer-events","none");
                $("#init").animate({opacity: "0"}, 500);
                $("#loading").animate({fontSize: "100px"}, 400);
            }, 1500 );
        }, 1000);
    }
    function load_themes(callback, loop) {
        const brightness = ["light", "light", "light", "dark", "dark", "dark"];
        const themes = [
            "orange-red", "green-blue", "pink-purple", "dark-red", "dark-green", "dark-blue"
        ];
        for(var i = 0; i < brightness.length; i++) {
            var stylesheet = "stylesheets/themes/"+brightness[i]+"/"+themes[i]+"-theme.css"
            $("#theme-css").attr("href", stylesheet);
        }
        stylesheet = "stylesheets/themes/light/orange-red-theme.css"
        $("#theme-css").attr("href", stylesheet);
        $("#orange-red").addClass("theme-template-active");
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
    load_themes(clear_loading, ellipses_loop);
});