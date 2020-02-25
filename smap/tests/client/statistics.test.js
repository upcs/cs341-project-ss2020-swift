//SMAP Team
//Testing for javascripts/statistics.js

"use strict";

var $ = require('jquery');

/*
  I tried so many ways to get external scripts to load correctly.
  I caught the load event handler for the script tag.
  I made a local copy of JQuery.
  I modified Jest's configs.
  But all I really needed was one line of code.

  External citation: https://info340.github.io/jest.html
*/
window.$ = $;

//Sample test for now
test('Create a slider', (done) => {

  //Creates mock document
  document.body.innerHTML = `
    <div id=slider_container>
      <div id="active_slider_template" class="statistic_setting_container">
        <div class="statistic_title">State GDP</div>
        <div class="metadata_button">&#9432;</div>
        <input type="range" min="1" max="5" value="3" id="stat1" class="range_slider" />
      </div>
    </div>
    <div id=statistic_selector><div id="inactive_slider_template" class="statistic_option">Job Openings</div></div>
  `;

  //Has side effects, so must be included in the test
  let script = require("../../public/javascripts/statistics");

  //The ready function. Since these callbacks are called in order,
  //  the one in statistics.js is called first to set up the event listener.
  $(function() {
    //Try-catch needed since this is an async test
    //See: https://jestjs.io/docs/en/asynchronous
    try {
      let stat = new script.Stat({title:"test stat", id:0}, script.DEFAULT_WEIGHT);
      // expect($(".statistic_option").length).toEqual(2);
      // $(".statistic_option").click();
      // expect($(".statistic_option").length).toEqual(1);
      // expect($(".statistic_setting_container").length).toEqual(2);
      done();
    } catch (error) {
      done(error);
    }
  });
});
