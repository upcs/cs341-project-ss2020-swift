//SMAP Team
//testing visuals.js

"use strict";

const $ = require('jquery');
const rewire = require('rewire');
const visuals_path = '../../public/javascripts/visuals.js';
const index_path = '../../public/index';
window.$ = $;
const visuals = require(visuals_path);
// const index = require(index_path);

function resetMetadataAlertHTML(){
    document.body.innerHTML = `
    <body>
        <div id="nav-bar"></div>
        <div id="settings"></div>
        <div id="map-container"></div>
        <div id="about-container"></div>

        <div id="metadata-alert-container" class="alert-container hidden">
            <div id=metadata-title class="metadata-alert-element hidden">Error: Incomplete metadata</div>
            <div id=metadata-date class="metadata-alert-element hidden">init date text</div>
            <div id=metadata-notes class="metadata-alert-element hidden">init notes text</div>
            <div id=metadata-publisher class="metadata-alert-element hidden">init publisher text</div>
            <div id=loading-div class="loading"></div>
        </div>
    </body>
    `;
}

describe("getMetadata", () => {
    test("returns metadata", () => {
        let metadata = visuals.getMetadata();

        expect(metadata).toEqual(
            /*
            stat_name_short: "stat name short",
            publication_date: "publication date",
            note: "note",
            source: "source",
            original_source: "original source"
            */
            expect.anything() //should be in the form above, but I'm not mocking the $.get, so I can't test it here
        );
    });
});

    //TODO: if time, fix this for the for loop that used to be in prepareMetadataAlert
describe("prepareMetadataAlert", () => {
    beforeEach(resetMetadataAlertHTML);

    //Ideally, these would be fetched from over yonder in the visuals.js file, but I can't get that to work... TODO?
    // const blur_elements = [
    //     $("#nav-bar"), $("#settings"), $("#map-container"), $("#about-container")
    // ];

    test("returns metadata", () => {
        expect($("body").hasClass("unscrollable")).toBe(false);
        expect($("nav-bar").hasClass("blurred")).toBe(false);
        expect($("#metadata-alert-container").hasClass("hidden")).toBe(true);

        visuals.prepareMetadataAlert();

        expect($("body").hasClass("unscrollable")).toBe(true);
        expect($("#nav-bar").hasClass("blurred")).toBe(true);
        expect($("#metadata-alert-container").hasClass("hidden")).toBe(false);
    });
});


describe("showMetadataAlert", () => {
    beforeEach(resetMetadataAlertHTML);
    test("happy path, metadata all exists", () => {
        let metadata = {
            stat_name_short: "stat name short",
            publication_date: "publication date",
            note: "note",
            source: "source",
            original_source: "original source"
        };

        expect($("#metadata-title").text()).toBe("Error: Incomplete metadata");
        expect($("#metadata-date").text()).toBe("init date text");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("init publisher text");
        expect($("#loading-div").hasClass("hidden")).toBe(false);
        expect($("#metadata-title").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);

        visuals.showMetadataAlert(metadata);

        expect($("#metadata-title").text()).toBe("stat name short");
        expect($("#metadata-date").text()).toBe("publication date");
        expect($("#metadata-notes").text()).toBe("note");
        expect($("#metadata-publisher").text()).toBe("source: original source");
        expect($("#loading-div").hasClass("hidden")).toBe(true);
        expect($("#metadata-title").hasClass("hidden")).toBe(false);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(false);
    });

    test("null metadata", () => {
        let metadata = null;

        expect($("#metadata-title").text()).toBe("Error: Incomplete metadata");
        expect($("#metadata-date").text()).toBe("init date text");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("init publisher text");

        expect($("#loading-div").hasClass("hidden")).toBe(false);
        expect($("#metadata-title").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);

        visuals.showMetadataAlert(metadata);

        expect($("#metadata-title").text()).toEqual(
            expect.stringContaining("Error"),
            expect.stringContaining("[Mm]etadata")
        );

        expect($("#metadata-date").text()).toBe("init date text");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("init publisher text");

        expect($("#loading-div").hasClass("hidden")).toBe(false);
        expect($("#metadata-title").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);
    });

    test("empty metadata", () => {
        let metadata = {};

        expect($("#metadata-title").text()).toBe("Error: Incomplete metadata");
        expect($("#metadata-date").text()).toBe("init date text");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("init publisher text");

        expect($("#loading-div").hasClass("hidden")).toBe(false);
        expect($("#metadata-title").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);

        visuals.showMetadataAlert(metadata);

        expect($("#metadata-title").text()).toEqual(
            expect.stringContaining("Error"),
            expect.stringContaining("[Mm]etadata")
        );

        expect($("#metadata-date").text()).toBe("init date text");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("init publisher text");

        expect($("#loading-div").hasClass("hidden")).toBe(false);
        expect($("#metadata-title").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);
    });

    test("metadata with no title", () => {
        let metadata =
        {
        publication_date: "publication date",
        note: "note",
        source: "source",
        original_source: "original source"
        }

        expect($("#metadata-title").text()).toBe("Error: Incomplete metadata");
        expect($("#metadata-date").text()).toBe("init date text");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("init publisher text");

        expect($("#loading-div").hasClass("hidden")).toBe(false);
        expect($("#metadata-title").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);

        visuals.showMetadataAlert(metadata);

        expect($("#metadata-title").text()).toEqual(
            expect.stringContaining("Error"),
            expect.stringContaining("[Mm]etadata")
        );

        expect($("#metadata-date").text()).toBe("init date text");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("init publisher text");

        expect($("#loading-div").hasClass("hidden")).toBe(false);
        expect($("#metadata-title").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);
    });

    test("metadata with no note", () => {
        let metadata =
        {
        stat_name_short: "stat name short",
        publication_date: "publication date",
        source: "source",
        original_source: "original source"
        }

        expect($("#metadata-title").text()).toBe("init title text");
        expect($("#metadata-title").text()).toBe("Error: Incomplete metadata");
        expect($("#metadata-date").text()).toBe("init date text");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("init publisher text");

        expect($("#loading-div").hasClass("hidden")).toBe(false);
        expect($("#metadata-title").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);

        visuals.showMetadataAlert(metadata);

        expect($("#metadata-title").text()).toBe("stat name short");
        expect($("#metadata-date").text()).toBe("publication date");
        expect($("#metadata-notes").text()).toBe("init notes text");
        expect($("#metadata-publisher").text()).toBe("source: original source");
        expect($("#loading-div").hasClass("hidden")).toBe(true);
        expect($("#metadata-title").hasClass("hidden")).toBe(false);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(false);
    });
});

describe("closeMetadataAlert", () => {
    resetMetadataAlertHTML();
    test("happy path, no params", () => {
        $("#nav-bar").addClass("blurred");       //because resetMetadataAlertHTML doesn't add blur
        $("body").addClass("unscrollable");
        $(".loading").addClass("hidden");
        $(".metadata-alert-element").removeClass("hidden");
        $("#metadata-alert-container").removeClass("hidden");

        expect($("#nav-bar").hasClass("blurred")).toBe(true);
        expect($("body").hasClass("unscrollable")).toBe(true);
        expect($(".loading").hasClass("hidden")).toBe(true);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(false);
        expect($("#metadata-alert-container").hasClass("hidden")).toBe(false);

        visuals.closeMetadataAlert();

        expect($("#nav-bar").hasClass("blurred")).toBe(false);
        expect($("body").hasClass("unscrollable")).toBe(false);
        expect($(".loading").hasClass("hidden")).toBe(false);
        expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);
        expect($("#metadata-alert-container").hasClass("hidden")).toBe(true);
    });
});
















//
