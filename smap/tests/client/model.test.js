//SMAP Team
//Testing for javascripts/statistics.js

"use strict";

const $ = require('jquery');
const rewire = require('rewire');
const path = '../../public/javascripts/model';
const model = require(path);

function resetData(){
  model.data.active = new Set();
  model.data.stats = {};
  model.data.restored = false;
}

beforeEach(resetData);

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
  let script = require(path);

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
      let stat = new script.Stat({title:"test stat", stat_id:0}, script.DEFAULT_WEIGHT);
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

describe('restoreFromStorage', () => {
  function FakeStat(id){
    this.category = {stat_id: id};
    this.weight = model.DEFAULT_WEIGHT;
  };

  beforeEach(() => {
    resetData();
    FakeStat.prototype.enable = jest.fn(function(){model.data.active.add(this.category.stat_id)});
    FakeStat.prototype.disable = jest.fn(function(){model.data.active.delete(this.category.stat_id)});
    FakeStat.prototype.updateWeight = jest.fn(function(weight){this.weight = weight});
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  test('null storage', () => {
    let script = rewire(path);
    let available = jest.fn(() => false);
    script.__set__('storageAvailable', available);
    let storage = window.localStorage;
    storage.setItem(script.storage.ACTIVE_SLIDER_KEY, "3");
    model.data.stats[3] = new FakeStat(3)
    expect(script.data.active.size).toEqual(0);
    expect(available.mock.calls.length).toEqual(0);
    expect(script.data.restored).toBeFalsy();
    script.storage.restore();
    expect(script.data.active.size).toEqual(0);
    expect(available.mock.calls.length).toEqual(1);
    expect(script.data.restored).toBeTruthy();
  });

  test('no weight stored', () => {
    let storage = window.localStorage;
    storage.setItem(model.storage.ACTIVE_SLIDER_KEY, "2");
    model.data.stats[2] = new FakeStat(2);
    expect(model.data.active.size).toEqual(0);
    expect(FakeStat.prototype.enable.mock.calls.length).toEqual(0);
    expect(model.data.restored).toBeFalsy();
    model.storage.restore();
    expect(model.data.active.size).toEqual(1);
    expect(model.data.active).toContain(2);
    expect(model.data.stats[2].weight).toEqual(model.DEFAULT_WEIGHT);
    expect(FakeStat.prototype.enable.mock.calls.length).toEqual(1);
    expect(model.data.restored).toBeTruthy();
  });

  test('one slider', () => {
    let storage = window.localStorage;
    storage.setItem(model.storage.ACTIVE_SLIDER_KEY, "2");
    storage.setItem(model.storage.ACTIVE_SLIDER_PREFIX + "2", "4");
    model.data.stats[2] = new FakeStat(2);
    expect(model.data.active.size).toEqual(0);
    expect(FakeStat.prototype.enable.mock.calls.length).toEqual(0);
    expect(FakeStat.prototype.updateWeight.mock.calls.length).toEqual(0);
    expect(model.data.restored).toBeFalsy();
    model.storage.restore();
    expect(model.data.active.size).toEqual(1);
    expect(model.data.active).toContain(2);
    expect(FakeStat.prototype.enable.mock.calls.length).toEqual(1);
    expect(FakeStat.prototype.updateWeight.mock.calls.length).toEqual(1);
    expect(FakeStat.prototype.updateWeight.mock.calls[0][0]).toEqual(4);
    expect(model.data.stats[2].weight).toEqual(4);
    expect(model.data.restored).toBeTruthy();
  });

  test('multiple sliders', () => {
    let storage = window.localStorage;
    storage.setItem(model.storage.ACTIVE_SLIDER_KEY, "2,3");
    storage.setItem(model.storage.ACTIVE_SLIDER_PREFIX + "2", "4");
    storage.setItem(model.storage.ACTIVE_SLIDER_PREFIX + "3", "1");
    model.data.stats[2] = new FakeStat(2);
    model.data.stats[3] = new FakeStat(3);
    expect(model.data.active.size).toEqual(0);
    expect(FakeStat.prototype.enable.mock.calls.length).toEqual(0);
    expect(FakeStat.prototype.updateWeight.mock.calls.length).toEqual(0);
    expect(model.data.restored).toBeFalsy();
    model.storage.restore();
    expect(model.data.active.size).toEqual(2);
    expect(model.data.active).toContain(2);
    expect(model.data.active).toContain(3);
    expect(FakeStat.prototype.enable.mock.calls.length).toEqual(2);
    expect(FakeStat.prototype.updateWeight.mock.calls.length).toEqual(2);
    expect(FakeStat.prototype.updateWeight.mock.calls[0][0]).toEqual(4);
    expect(FakeStat.prototype.updateWeight.mock.calls[1][0]).toEqual(1);
    expect(model.data.stats[2].weight).toEqual(4);
    expect(model.data.stats[3].weight).toEqual(1);
    expect(model.data.restored).toBeTruthy();
  });
});
