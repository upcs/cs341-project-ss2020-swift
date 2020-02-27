

$("document").ready(function () {
    $(".theme-template").click( function() {
        var theme_id = $(this).attr("id");
        var brightness = $(this).parent().attr("id");
        $(".theme-template-active").addClass("theme-template").removeClass("theme-template-active");
        $(this).addClass("theme-template-active").removeClass("theme-template");
        var stylesheet = "stylesheets/themes/"+brightness+"/"+theme_id+"-theme.css"
        $("#theme-css").attr("href", stylesheet);
        const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
            "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
            "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR",
            "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
        for(var i = 0; i < states.length; i++) {
            color_state(states[i], Math.random());
        }
    });
});