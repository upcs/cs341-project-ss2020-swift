//SMAP Team
//Testing for javascripts/statistics.js

"use strict";

const $ = require('jquery');
const rewire = require('rewire');
const path = '../../public/javascripts/model';
const model = require(path);
const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
"ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
"MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR",
"PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

function resetData(){
  model.data.active = new Set();
  model.data.stats = {};
  model.data.restored = false;
  model.data.ranks = states.slice();
  model.data.metadataFetched = false;
}

beforeEach(resetData);

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

  //Has side effects, so must be included in the test
  let script = require(path);

  // Note: Check if function is called
  window.colorState = jest.fn( () => {} );
  window.makeActiveSlider = jest.fn( () => { return active_slider; } );
  window.makeInactiveSlider = jest.fn( () => { return inactive_slider; } );
  window.drawChart = jest.fn(() => {});

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
  test("50 good states, no inversion, using require NOT rewire", () => {
    //require runs the script
      //in jquery stuff, require makes a document.ready
    let script = require("../../public/javascripts/model");

    let row = {
      stat_id: 1,
      invert_flag: 0,
      AL: 100,
      AK: 300,
      AZ: 200,
      /////////
      AR: 100,
      CA: 100,
      CO: 100,
      CT: 100,
      DE: 100,
      FL: 100,
      GA: 100,
      HI: 100,
      ID: 100,
      IL: 100,
      IN: 100,
      IA: 100,
      KS: 100,
      KY: 100,
      LA: 100,
      ME: 100,
      MD: 100,
      MA: 100,
      MI: 100,
      MN: 100,
      MS: 100,
      MO: 100,
      MT: 100,
      NE: 100,
      NV: 100,
      NH: 100,
      NJ: 100,
      NM: 100,
      NY: 100,
      NC: 100,
      ND: 100,
      OH: 100,
      OK: 100,
      OR: 100,
      PA: 100,
      RI: 100,
      SC: 100,
      SD: 100,
      TN: 100,
      TX: 100,
      UT: 100,
      VT: 100,
      VA: 100,
      WA: 100,
      WV: 100,
      WI: 100,
      WY: 100
    }

    script.normalizeStats(row);

    expect(row["AK"]).toEqual(1); //max
    expect(row["AL"]).toEqual(0); //min
    expect(row["AZ"]).toEqual(.5);
  });

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

  test("all states same value, not 0", () => {
    let script = rewire("../../public/javascripts/model");
    let states = script.__get__("states");

    //starting at index 3, remove 47 states
    states.splice(3,47);

    let row = {
      stat_id: 1,
      invert_flag: 0,
      AL: 100,
      AK: 100,
      AZ: 100
    }

    script.normalizeStats(row); //modifies in place from
    expect(row["AL"]).toEqual(0.5);
    expect(row["AK"]).toEqual(0.5);
    expect(row["AZ"]).toEqual(0.5);
  });

  test("all states 0", () => {
    let script = rewire("../../public/javascripts/model");
    let states = script.__get__("states");

    //starting at index 3, remove 47 states
    states.splice(3,47);

    let row = {
      stat_id: 1,
      invert_flag: 0,
      AL: 0,
      AK: 0,
      AZ: 0
    }

    script.normalizeStats(row); //modifies in place from
    expect(row["AL"]).toEqual(0);
    expect(row["AK"]).toEqual(0);
    expect(row["AZ"]).toEqual(0);
  });

  test("all states are negative except max which is 0", () => {
    let script = rewire("../../public/javascripts/model");
    let states = script.__get__("states");

    //starting at index 3, remove 47 states
    states.splice(3,47);

    let row = {
      stat_id: 1,
      invert_flag: 0,
      AL: -100,
      AK: -100,
      AZ: 0
    }

    script.normalizeStats(row); //modifies in place from
    expect(row["AL"]).toEqual(0);
    expect(row["AK"]).toEqual(0);
    expect(row["AZ"]).toEqual(1);
  });
});

describe('displayWeights', () => {
    beforeEach(resetData);

    test('test1: no states, require', () => {
        let script = require("../../public/javascripts/model");
        let states = {
          stat_id: 1,
          invert_flag: 0,
          AL: 100,
          AK: 300,
          AZ: 200,
          /////////
          AR: 100,
          CA: 100,
          CO: 100,
          CT: 100,
          DE: 100,
          FL: 100,
          GA: 100,
          HI: 100,
          ID: 100,
          IL: 100,
          IN: 100,
          IA: 100,
          KS: 100,
          KY: 100,
          LA: 100,
          ME: 100,
          MD: 100,
          MA: 100,
          MI: 100,
          MN: 100,
          MS: 100,
          MO: 100,
          MT: 100,
          NE: 100,
          NV: 100,
          NH: 100,
          NJ: 100,
          NM: 100,
          NY: 100,
          NC: 100,
          ND: 100,
          OH: 100,
          OK: 100,
          OR: 100,
          PA: 100,
          RI: 100,
          SC: 100,
          SD: 100,
          TN: 100,
          TX: 100,
          UT: 100,
          VT: 100,
          VA: 100,
          WA: 100,
          WV: 100,
          WI: 100,
          WY: 100
      }

        /*
        let row = {
        stat_id: 1,
        invert_flag: 0,
        AL: 100,
        AK: 200,
        AZ: 300
        }
        */

        let testWeights = {
            AL: 99,
            AK: 99,
            AZ: 99
        };

        window.colorState = jest.fn((state, weight) => {
            testWeights[state] = weight;
        });

        //making sure the function is called 50 times even though it won't be
        // expect(window.colorState.mock.calls.length).toBe(50);

        expect(testWeights["AL"]).toEqual(99);
        expect(testWeights["AK"]).toEqual(99);
        expect(testWeights["AZ"]).toEqual(99);

        model.displayWeights();

        expect(testWeights["AL"]).toEqual(0);
        expect(testWeights["AK"]).toEqual(0);
        expect(testWeights["AZ"]).toEqual(0);
    });

    /*
        notes:
            "window."" overrides colorState because it's defined in a different file from model.js
            you can override it with jest.fn lambda or not.
            If you use the jest.fn stuff,
                then you're mocking the function. When you mock the function,
                you can do things like test how many times the mock function is called in the test.
            if not,
                you can still compare to a list of outputs and expected outputs

            require is once per file
            rewire is rerun every call
    */

    // test('1 active statistic, stat.data==1, rewire', () => { //should work
    //     let model = require("../../public/javascripts/model");
    //     let visuals = require("../../public/javascripts/visuals");
    //     // let states = model.__get__("states");
    //     // states.splice(3,47);

    //     let states = {
    //       stat_id: 1,
    //       invert_flag: 0,
    //       AL: 100,
    //       AK: 300,
    //       AZ: 200,
    //       /////////
    //       AR: 100,
    //       CA: 100,
    //       CO: 100,
    //       CT: 100,
    //       DE: 100,
    //       FL: 100,
    //       GA: 100,
    //       HI: 100,
    //       ID: 100,
    //       IL: 100,
    //       IN: 100,
    //       IA: 100,
    //       KS: 100,
    //       KY: 100,
    //       LA: 100,
    //       ME: 100,
    //       MD: 100,
    //       MA: 100,
    //       MI: 100,
    //       MN: 100,
    //       MS: 100,
    //       MO: 100,
    //       MT: 100,
    //       NE: 100,
    //       NV: 100,
    //       NH: 100,
    //       NJ: 100,
    //       NM: 100,
    //       NY: 100,
    //       NC: 100,
    //       ND: 100,
    //       OH: 100,
    //       OK: 100,
    //       OR: 100,
    //       PA: 100,
    //       RI: 100,
    //       SC: 100,
    //       SD: 100,
    //       TN: 100,
    //       TX: 100,
    //       UT: 100,
    //       VT: 100,
    //       VA: 100,
    //       WA: 100,
    //       WV: 100,
    //       WI: 100,
    //       WY: 100
    //   }

    //     let testWeights = {
    //         AL: 99,
    //         AK: 99,
    //         AZ: 99
    //     };

    //     let mockCatID = 1;
    //     model.data.active.add(mockCatID);

    //     model.data.stats[mockCatID] = {
    //         "category": {
    //             "title": "fake title"
    //         },
    //         "data": {
    //             "AL": 2,
    //             "AK": 4,
    //             "AZ": 6
    //         }
    //     };

    //     window.colorState = jest.fn((state, weight) => {
    //         testWeights[state] = weight;
    //     });

    //     //making sure the function is called 50 times even though it won't be
    //     // expect(window.colorState.mock.calls.length).toBe(50);

    //     expect(testWeights["AL"]).toEqual(99);
    //     expect(testWeights["AK"]).toEqual(99);
    //     expect(testWeights["AZ"]).toEqual(99);

    //     model.displayWeights();

    //     expect(testWeights["AL"]).toEqual(0);
    //     expect(testWeights["AZ"]).toEqual(1);
    //     expect(testWeights["AK"]).toEqual(0.5);
    // });
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
    let available = jest.fn(() => {});
    script.__set__('setStorage', available);
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

describe('updateCategoryStorage', () => {

  let spy;
  let setItem;

  beforeEach(() => {
    resetData();
    setItem = jest.fn(() => {});
    spy = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      return {
        setItem: setItem,
        removeItem: () => {}
      }
    });

    //This will call setItem and removeItem
    model.storage.reset();
  });

  afterEach(() => {
    spy.mockRestore();
  });

  test('not restored', () => {
    model.data.active.add(2);
    expect(model.data.restored).toBeFalsy();
    expect(setItem.mock.calls.length).toEqual(1);
    model.storage.updateCategory();
    expect(setItem.mock.calls.length).toEqual(1);
  });

  test('nothing active', () => {
    model.data.restored = true;
    expect(model.data.active.size).toEqual(0);
    expect(setItem.mock.calls.length).toEqual(1);
    model.storage.updateCategory();
    expect(setItem.mock.calls.length).toEqual(2);
    expect(setItem.mock.calls[1]).toEqual([model.storage.ACTIVE_SLIDER_KEY, ""]);
  });

  test('one active', () => {
    model.data.restored = true;
    model.data.active.add(2);
    expect(setItem.mock.calls.length).toEqual(1);
    model.storage.updateCategory();
    expect(setItem.mock.calls.length).toEqual(2);
    expect(setItem.mock.calls[1]).toEqual([model.storage.ACTIVE_SLIDER_KEY, "2"]);
  });

  test('many active', () => {
    model.data.restored = true;
    model.data.active.add(2);
    model.data.active.add(3);
    expect(setItem.mock.calls.length).toEqual(1);
    model.storage.updateCategory();
    expect(setItem.mock.calls.length).toEqual(2);
    expect(setItem.mock.calls[1]).toEqual([model.storage.ACTIVE_SLIDER_KEY, "2,3"]);
  });
});

describe('updateWeightStorage', () => {
  let spy;
  let setItem;
  let removeItem;

  beforeEach(() => {
    resetData();
    setItem = jest.fn(() => {});
    removeItem = jest.fn(() => {});
    spy = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      return {
        setItem: setItem,
        removeItem: removeItem
      }
    });

    //This will call setItem and removeItem
    model.storage.reset();
  });

  afterEach(() => {
    spy.mockRestore();
  });

  test('not restored', () => {
    model.data.stats[2] = {weight: 1};
    expect(model.data.restored).toEqual(false);
    expect(setItem.mock.calls.length).toEqual(1);
    expect(removeItem.mock.calls.length).toEqual(1);
    model.storage.updateWeight(2);
    expect(setItem.mock.calls.length).toEqual(1);
    expect(removeItem.mock.calls.length).toEqual(1);
  });

  test('invalid weight', () => {
    model.data.stats[2] = {weight: -1};
    model.data.restored = true;
    expect(setItem.mock.calls.length).toEqual(1);
    expect(removeItem.mock.calls.length).toEqual(1);
    model.storage.updateWeight(2);
    expect(setItem.mock.calls.length).toEqual(1);
    expect(removeItem.mock.calls.length).toEqual(2);
    expect(removeItem.mock.calls[1]).toEqual([model.storage.ACTIVE_SLIDER_PREFIX+"2"]);
  });

  test('invalid cat', () => {
    model.data.restored = true;
    expect(setItem.mock.calls.length).toEqual(1);
    expect(removeItem.mock.calls.length).toEqual(1);
    model.storage.updateWeight(2);
    expect(setItem.mock.calls.length).toEqual(1);
    expect(removeItem.mock.calls.length).toEqual(1);
  });

  test('valid cat', () => {
    model.data.stats[2] = {weight: 4};
    model.data.restored = true;
    expect(setItem.mock.calls.length).toEqual(1);
    expect(removeItem.mock.calls.length).toEqual(1);
    model.storage.updateWeight(2);
    expect(setItem.mock.calls.length).toEqual(2);
    expect(setItem.mock.calls[1]).toEqual([model.storage.ACTIVE_SLIDER_PREFIX+"2", 4]);
    expect(removeItem.mock.calls.length).toEqual(1);
  });
});

describe('calculateWeight: ', () => {
  test("1.8^0", () => {
    let script = require("../../public/javascripts/model");

    let ans = script.calculateWeight(0);

    expect(ans).toEqual(0);
    expect(script.calculateWeight(1)).toEqual(1);
    expect(script.calculateWeight(2)).toEqual(1.8);
    expect(script.calculateWeight(3)).toEqual(3.24);
    expect(script.calculateWeight(-1)).toEqual(0);
    expect(script.calculateWeight(1.5)).toEqual(0);
  });
});

//TODO: Reset data on merge
describe('getStateInfo', () => {
  beforeEach(resetData);

  test('happy path', () => {
    let script = require("../../public/javascripts/model");
    script.data.active.add(1);
    script.data.stats[1] = {
      rankings: ["AR", "AL", "OH"],
      data: {
        "AR": 5,
        "AL": 3,
        "OH": 2
      },
      category: {title: "Fake Stat 1"}
    };
    script.data.active.add(2);
    script.data.stats[2] = {
      rankings: ["AL", "AR", "OH"],
      data: {
        "AR": 2,
        "AL": 10,
        "OH": 1
      },
      category: {title: "Fake Stat 2"}
    };
    expect(script.getStateInfo("AL")).toEqual([
      {id:2, rank:1, value:10, name:"Fake Stat 2"},
      {id:1, rank:2, value:3, name:"Fake Stat 1"}
    ]);
  });

  test('bad state', () => {
    let script = require("../../public/javascripts/model");
    script.data.active.add(1);
    script.data.stats[1] = {
      rankings: ["AR", "AL", "OH"],
      data: {
        "AR": 5,
        "AL": 3,
        "OH": 2
      }
    };
    script.data.active.add(2);
    script.data.stats[2] = {
      rankings: ["AL", "AR", "OH"],
      data: {
        "AR": 2,
        "AL": 10,
        "OH": 1
      }
    };
    expect(script.getStateInfo("FK")).toEqual([]);
  });

  test('no rankings', () => {
    let script = require("../../public/javascripts/model");
    script.data.active.add(1);
    script.data.stats[1] = {
      rankings: ["AR", "AL", "OH"],
      data: {
        "AR": 5,
        "AL": 3,
        "OH": 2
      },
      category: {title:"Fake Stat 1"}
    };
    script.data.active.add(2);
    script.data.stats[2] = {
      data: {
        "AR": 2,
        "AL": 10,
        "OH": 1
      },
      category: {title:"Fake Stat 2"}
    };
    expect(script.getStateInfo("AL")).toEqual([
      {id:1, rank:2, value:3, name:"Fake Stat 1"}
    ]);
  })
});

describe("rankStats", () => {
  test('happy path', () => {
    let script = require("../../public/javascripts/model");
    let data = {
      "AR": 2,
      "AL": 10,
      "OH": 1
    };
    for (let state of states){
      if (["AR", "AL", "OH"].indexOf(state) === -1) data[state] = 0;
    }
    expect(script.rankStats(data).slice(0, 3)).toEqual(["AL", "AR", "OH"]);
  });

  test('missing states', () => {
    let script = require("../../public/javascripts/model");
    let data = {
      "AR": 2,
      "AL": 10,
      "OH": 1
    };
    expect(script.rankStats(data)).toEqual([]);
  });
});
describe('setMetadata', () => {
  beforeEach(resetData);

  test('happy path', () => {
    let metadata = [{
      stat_id:1,
      note:{
        type:"Buffer",
        data:[104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
      },
      stat_name_short:"Fake stat",
      publication_date: "Just now",
      source: "Ryan Regier",
      oroginal_source: "pilots.up.edu"
    }];
    let stat = {};
    model.data.stats[1] = stat;
    model.setMetadata(metadata);
    expect(stat).toHaveProperty("metadata");
    expect(stat.metadata.note).toEqual("hello world");
    expect(stat.metadata).toBe(metadata[0]);
  });

  test('bad metadata', () => {
    let stat = {};
    model.data.stats[1] = stat;
    model.setMetadata(null);
    expect(model.data.stats[1]).toEqual({});
    model.setMetadata(undefined);
    expect(model.data.stats[1]).toEqual({});
    model.setMetadata([]);
    expect(model.data.stats[1]).toEqual({});
  });

  test('multiple stats', () => {
    let metadata = [{
      stat_id: 3,
      note: {data: []},
    },
    {
      stat_id: 1,
      note: {data: []},
    },
    {
      stat_id: 2,
      note: {data: []}
    }];

    let stat2 = {};
    let stat3 = {};
    model.data.stats[2] = stat2;
    model.data.stats[3] = stat3;
    model.setMetadata(metadata);
    expect(stat2.metadata).toBe(metadata[2]);
    expect(stat3.metadata).toBe(metadata[0]);
  });
});

describe('Stat show metadata', () => {

  beforeEach(() => {
    resetData();
    window.prepareMetadataAlert = jest.fn(() => {});
    window.showMetadataAlert = jest.fn(() => {});
    window.closeMetadataAlert = jest.fn(() => {});
    window.getMetadata = jest.fn(() => {}); //TODO: Make a promise
  });

  test('happy path', () => {
    let metadata = {};
    model.data.metadataFetched = true;
    let stat = {stat_id:3, metadata: metadata};
    model.Stat.prototype.showMeta.apply(stat);
    expect(window.prepareMetadataAlert).toHaveBeenCalled();
    expect(window.showMetadataAlert).toHaveBeenCalled();
    expect(window.closeMetadataAlert).not.toHaveBeenCalled();
    expect(window.getMetadata).not.toHaveBeenCalled();
  });
})
