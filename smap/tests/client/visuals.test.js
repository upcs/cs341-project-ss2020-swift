//SMAP Team
//testing visuals.js

const $ = require('jquery');
const rewire = require('rewire');
const path = '../../public/javascripts/visuals.js';
window.$ = $;
const visuals = require(path);


describe("getMetadata", () => {
    test("returns metadata", () => {
        let getMetadata = jest.fn(() => {
            visuals.getMetadata();
        });
        let metadata = getMetadata();
        expect(getMetadata).toHaveBeenCalledTimes(1);
        expect.anything();
    });
});

describe("prepareMetadataAlert", () => {
    test("returns metadata", () => {
        document.body.innerHTML = `
        <div id=metadata-title class="metadata-alert-item">init title text</div>
        <div id=metadata-date class="metadata-alert-item">init date text</div>
        <div id=metadata-notes class="metadata-alert-item">init notes text</div>
        <div id=metadata-publisher class="metadata-alert-item">init publisher text</div>
        <div id=loading-div class="loading"></div>
        `
        // expect("body")
        //todo: finish this test
        visuals.prepareMetadataAlert();

        expect.anything();
    });
});

function resetHTML(){
    document.body.innerHTML = `
        <div id=metadata-title class="metadata-alert-element hidden">init title text</div>
        <div id=metadata-date class="metadata-alert-element hidden">init date text</div>
        <div id=metadata-notes class="metadata-alert-element hidden">init notes text</div>
        <div id=metadata-publisher class="metadata-alert-element hidden">init publisher text</div>
        <div id=loading-div class="loading"></div>
        `;
}

describe("showMetadataAlert", () => {
    beforeEach(resetHTML);
    test("happy path, metadata all exists", () => {
        let metadata = {
            stat_name_short: "stat name short",
            publication_date: "publication date",
            note: "note",
            source: "source",
            original_source: "original source"
        };

        expect($("#metadata-title").text()).toBe("init title text");
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

        expect($("#metadata-title").text()).toBe("init title text");
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

        expect($("#metadata-title").text()).toBe("init title text");
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

        expect($("#metadata-title").text()).toBe("init title text");
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
