//SMAP Team
//Testing for javascripts/statistics.js

"use strict";

const $ = require('jquery');
const rewire = require('rewire');

/*
  I tried so many ways to get external scripts to load correctly.
  I caught the load event handler for the script tag.
  I made a local copy of JQuery.
  I modified Jest's configs.3
  But all I really needed was one line of code.

  External citation: https://info340.github.io/jest.html
*/
window.$ = $;
// window.mixColor = jest.fn(weight => "rgba(0,0,0,1)");

//Sample test for now
//add a done here for async tests
test('Create a slider', () => {
  //Creates mock document
  document.body.innerHTML = `
    <div id=statistics-sliders>
      <div id="active_slider_template" class="statistic-slider-container">
        <div class="statistic-slider-title">State GDP</div>
        <div class="metadata_button">&#9432;</div>
        <input type="range" min="1" max="5" value="3" id="stat1" class="statistic-slider" />
      </div>
    </div>
    <div id=statistics-selector><div id="inactive_slider_template" class="statistic-option">Job Openings</div></div>
  `;

  let inactive_slider = $("#inactive_slider_template");
  let active_slider = $("#active_slider_template");
  //Has side effects (when 'require' is replaced with 'rewire'), so must be included in the test
  let script = require("../../public/javascripts/model");

  // Note: Check if function is called
  window.colorState = jest.fn( () => {} );
  window.makeActiveSlider = jest.fn( () => { return active_slider; } );
  window.makeInactiveSlider = jest.fn( () => { return inactive_slider; } );
  //you can uncomment line below if you reWIRE(../../public/javascripts/model) from a few lines prior
  // script.__set__("displayWeights", () => {});
  // var spy = jest.spyOn(script, "displayWeights").mockImplementation( () => {} );

  let stat = new script.Stat({title:"test stat", id:0}, script.DEFAULT_WEIGHT);
  expect($(".statistic-option").length).toEqual(1);
  expect(window.makeActiveSlider.mock.calls.length).toBe(0);
  // expect($(".statistic-slider-container").length).toEqual(0);
  inactive_slider.click();
  expect($(".statistic-option").length).toEqual(0);
  expect(window.makeActiveSlider.mock.calls.length).toBe(1);

//reference for async tests
    //The ready function. Since these callbacks are called in order,
    //  the one in visuals.js is called first to set up the event listener.
    // $(function() {
      //Try-catch needed since this is an async test
      //See: https://jestjs.io/docs/en/asynchronous
      //some test code in here
    // });
});

//describe appends the message in the first param before each test in the block
describe('normalizeStats: ', () => {
  test("3 good states, no inversion", () => {
    //require runs the script
      //in jquery stuff, require makes a document.ready
    let script = rewire("../../public/javascripts/model");
    let states = script.__get__("states");

    //starting at index 3, remove 47 states
    states.splice(3,47);

    let row1 = {
      stat_id: 1,
      invert_flag: 0,
      AL: 100,
      AK: 300,
      AZ: 200
    }
    script.normalizeStats(row1);

    expect(row1["AK"]).toEqual(1); //max
    expect(row1["AL"]).toEqual(0); //min
    expect(row1["AZ"]).toEqual(.5);
  });

  test("3 good states, with inversion", () => {
    let script = rewire("../../public/javascripts/model");
    let states = script.__get__("states");

    //starting at index 3, remove 47 states
    states.splice(3,47);

    let row = {
      stat_id: 1,
      invert_flag: 1,
      AL: 100,
      AK: 300,
      AZ: 200
    }

    script.normalizeStats(row); //modifies in place from
    expect(row["AL"]).toEqual(1); //max
    expect(row["AK"]).toEqual(0); //min
    expect(row["AZ"]).toEqual(0.5); //middle
  });

  test("2 good states, and 1 state with init value of 0, no inversion", () => {
    let script = rewire("../../public/javascripts/model");
    let states = script.__get__("states");

    //starting at index 3, remove 47 states
    states.splice(3,47);

    let row = {
      stat_id: 1,
      invert_flag: 0,
      AL: 100,
      AK: 0,
      AZ: 200
    }

    script.normalizeStats(row); //modifies in place from
    expect(row["AL"]).toEqual(0.5); //middle
    expect(row["AZ"]).toEqual(1); //max
    expect(row["AK"]).toEqual(0); //min
  });

  test("2 good states, and 1 bad state without inversion", () => {
    let script = rewire("../../public/javascripts/model");
    let states = script.__get__("states");

    //starting at index 3, remove 47 states
    states.splice(3,47);

    let row = {
      stat_id: 1,
      invert_flag: 0,
      AL: 100,
      AK: 300,
      AZ: -100
    }

    script.normalizeStats(row); //modifies in place from
    expect(row["AL"]).toEqual(0.5); //middle
    expect(row["AK"]).toEqual(1); //max
    expect(row["AZ"]).toEqual(0); //min
  });

});
