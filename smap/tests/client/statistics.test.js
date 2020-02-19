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
    <div id=slider_container></div>
    <div id=statistic_selector></div>
  `;

  //Has side effects, so must be included in the test
  let script = require("../../public/javascripts/statistics");

  //The ready function. Since these callbacks are called in order,
  //  the one in statistics.js is called first to set up the event listener.
  $(function() {
    //Try-catch needed since this is an async test
    //See: https://jestjs.io/docs/en/asynchronous
    try {
      expect($(".statistic_option").length).toEqual(1);
      $(".statistic_option").click();
      expect($(".statistic_option").length).toEqual(0);
      expect($(".statistic_setting_container").length).toEqual(1);
      done();
    } catch (error) {
      done(error);
    }
  });
});
