//SMAP Team
//Testing for javascripts/statistics.js

"use strict";

const $ = require('jquery');
const rewire = require('rewire');

/*
  I tried so many ways to get external scripts to load correctly.
  I caught the load event handler for the script tag.
  I made a local copy of JQuery.
  I modified Jest's configs.
  But all I really needed was one line of code.

  External citation: https://info340.github.io/jest.html
*/
window.$ = $;
// window.mixColor = jest.fn(weight => "rgba(0,0,0,1)");

//Sample test for now
test('Create a slider', (done) => {

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
  //Has side effects, so must be included in the test
  let script = require("../../public/javascripts/model");

  // Note: Check if function is called
  window.colorState = jest.fn( () => {} );
  window.makeActiveSlider = jest.fn( () => { return active_slider; } );
  window.makeInactiveSlider = jest.fn( () => { return inactive_slider; } );
  // script.__set__("displayWeights", () => {});
  // var spy = jest.spyOn(script, "displayWeights").mockImplementation( () => {} );


  //The ready function. Since these callbacks are called in order,
  //  the one in statistics.js is called first to set up the event listener.
  $(function() {
    //Try-catch needed since this is an async test
    //See: https://jestjs.io/docs/en/asynchronous
    try {
      let stat = new script.Stat({title:"test stat", id:0}, script.DEFAULT_WEIGHT);
      expect($(".statistic-option").length).toEqual(1);
      expect(window.makeActiveSlider.mock.calls.length).toBe(0);
      // expect($(".statistic-slider-container").length).toEqual(0);
      inactive_slider.click();
      expect($(".statistic-option").length).toEqual(0);
      expect(window.makeActiveSlider.mock.calls.length).toBe(1);
      // expect($(".statistic-slider-container").length).toEqual(1);
      done();
    } catch (error) {
      done(error);
    }
  });
});
