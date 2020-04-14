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
  model.data.weights = {};
}

afterEach(resetData);

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
/*
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

  let stat = new script.Stat({title:"test stat", stat_id:0}, script.DEFAULT_WEIGHT);
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
*/

describe('setMetadata', () => {
  afterEach(resetData);

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

describe('calculateWeight: ', () => {
  test("calculate", () => {
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

describe('getStateInfo', () => {
  afterEach(resetData);

  test('happy path', () => {
    model.data.active.add(1);
    model.data.stats[1] = {
      rankings: ["AR", "AL", "OH"],
      data: {
        "AR": 5,
        "AL": 3,
        "OH": 2
      },
      category: {title: "Fake Stat 1"}
    };
    model.data.active.add(2);
    model.data.stats[2] = {
      rankings: ["AL", "AR", "OH"],
      data: {
        "AR": 2,
        "AL": 10,
        "OH": 1
      },
      category: {title: "Fake Stat 2"}
    };
    expect(model.getStateInfo("AL")).toEqual([
      {id:2, rank:1, value:10, name:"Fake Stat 2"},
      {id:1, rank:2, value:3, name:"Fake Stat 1"}
    ]);
    expect(model.getStateInfo("AR")).toEqual([
      {id:1, rank:1, value:5, name:"Fake Stat 1"},
      {id:2, rank:2, value:2, name:"Fake Stat 2"}
    ]);
  });

  test('bad state', () => {
    model.data.active.add(1);
    model.data.stats[1] = {
      rankings: ["AR", "AL", "OH"],
      data: {
        "AR": 5,
        "AL": 3,
        "OH": 2
      }
    };
    model.data.active.add(2);
    model.data.stats[2] = {
      rankings: ["AL", "AR", "OH"],
      data: {
        "AR": 2,
        "AL": 10,
        "OH": 1
      }
    };
    expect(model.getStateInfo("FK")).toEqual([]);
  });

  test('no rankings', () => {
    model.data.active.add(1);
    model.data.stats[1] = {
      rankings: ["AR", "AL", "OH"],
      data: {
        "AR": 5,
        "AL": 3,
        "OH": 2
      },
      category: {title:"Fake Stat 1"}
    };
    model.data.active.add(2);
    model.data.stats[2] = {
      data: {
        "AR": 2,
        "AL": 10,
        "OH": 1
      },
      category: {title:"Fake Stat 2"}
    };
    expect(model.getStateInfo("AL")).toEqual([
      {id:1, rank:2, value:3, name:"Fake Stat 1"}
    ]);
  });
});

describe('displayWeights', () => {
    afterEach(resetData);

    function makeFakeStat(id, invert_flag){
      let data = {
        stat_id: id,
        invert_flag: invert_flag
      };
      states.forEach((state, i) => {
        data[state] = 0.5
      });
      return {
        category: {title: "Fake", stat_id: id},
        data: data,
        weight: 1
      };
    }

    test('one stat', () => {
        model.data.active.add(1);
        let stat = makeFakeStat(1, 0);
        stat.data.AK = 0;
        model.data.stats[1] = stat;

        window.colorState = jest.fn(() => {});
        let mockCalls = window.colorState.mock.calls;

        expect(mockCalls.length).toEqual(0);
        expect(model.data.weights).toEqual({});
        expect(model.data.ranks).toEqual(states);

        model.displayWeights();

        expect(mockCalls.length).toEqual(50);
        expect(mockCalls[0]).toEqual(["AL", 1]);
        expect(mockCalls[1]).toEqual(["AK", 0]);
        expect(Object.keys(model.data.weights)).toEqual(states);
        expect(model.data.weights.AL).toEqual(1);
        expect(model.data.weights.AK).toEqual(0);
        expect(model.data.ranks[49]).toEqual("AK");
    });

    test('multiple stats', () => {
        model.data.active.add(1);
        let stat1 = makeFakeStat(1, 0);
        stat1.data.AL = 0;
        stat1.data.AK = 1;
        model.data.stats[1] = stat1;

        model.data.active.add(2);
        let stat2 = makeFakeStat(2, 0);
        stat2.data.AL = 0.2;
        stat2.data.AK = 0.8;
        model.data.stats[2] = stat2;

        window.colorState = jest.fn(() => {});
        let mockCalls = window.colorState.mock.calls;

        expect(mockCalls.length).toEqual(0);
        expect(model.data.weights).toEqual({});
        expect(model.data.ranks).toEqual(states);

        model.displayWeights();

        expect(mockCalls.length).toEqual(50);
        expect(mockCalls[0]).toEqual(["AL", 0]);
        expect(mockCalls[1]).toEqual(["AK", 1]);
        expect(mockCalls[2]).toEqual(["AZ", 0.5]);
        expect(Object.keys(model.data.weights)).toEqual(states);
        expect(model.data.ranks[0]).toEqual("AK");
        expect(model.data.ranks[49]).toEqual("AL");
    });

    test('inactive stat', () => {
        let stat2 = makeFakeStat(2, 0);
        stat2.data.AL = 0.2;
        stat2.data.AK = 0.8;
        model.data.stats[2] = stat2;

        window.colorState = jest.fn(() => {});
        let mockCalls = window.colorState.mock.calls;

        expect(mockCalls.length).toEqual(0);
        expect(model.data.weights).toEqual({});
        expect(model.data.ranks).toEqual(states);

        model.displayWeights();

        expect(mockCalls.length).toEqual(50);
        expect(mockCalls[0]).toEqual(["AL", 0]);
        expect(model.data.weights.AL).toEqual(0);
        expect(model.data.ranks).toEqual(states);
    });

    test('unloaded stat', () => {
      model.data.active.add(2);
      let stat2 = makeFakeStat(2, 0);
      delete stat2.data;
      model.data.stats[2] = stat2;

      window.colorState = jest.fn(() => {});
      let mockCalls = window.colorState.mock.calls;

      expect(mockCalls.length).toEqual(0);
      expect(model.data.weights).toEqual({});
      expect(model.data.ranks).toEqual(states);

      model.displayWeights();

      expect(mockCalls.length).toEqual(50);
      expect(mockCalls[0]).toEqual(["AL", 0]);
      expect(model.data.weights.AL).toEqual(0);
      expect(model.data.ranks).toEqual(states);
    });

    test('stat missing state', () => {
      model.data.active.add(2);
      let stat2 = makeFakeStat(2, 0);
      delete stat2.data.AK;
      model.data.stats[2] = stat2;

      window.colorState = jest.fn(() => {});
      let mockCalls = window.colorState.mock.calls;

      expect(mockCalls.length).toEqual(0);
      expect(model.data.weights).toEqual({});
      expect(model.data.ranks).toEqual(states);

      model.displayWeights();

      expect(mockCalls.length).toEqual(50);
      expect(mockCalls[0]).toEqual(["AL", 1]);
      expect(mockCalls[1]).toEqual(["AK", 0]);
      expect(mockCalls[2]).toEqual(["AZ", 1]);
      expect(model.data.weights.AL).toEqual(1);
      expect(model.data.weights.AK).toEqual(0);
      expect(model.data.ranks[49]).toEqual("AK");
    });

});

describe('Stat', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(model.Stat.prototype, "disable").mockImplementation(() => {});
  });

  afterEach(() => {
    resetData();
    spy.mockRestore();
  });

  test('missing category.stat_id', () => {
    let cat = {title: "Fake Cat"};
    expect(() => new model.Stat(cat, 2)).toThrow();
    expect(spy).not.toHaveBeenCalled();
  });

  test('missing category.title', () => {
    let cat = {stat_id: 2};
    expect(() => new model.Stat(cat, 2)).toThrow();
    expect(spy).not.toHaveBeenCalled();
    expect(model.data.stats[2]).toBeUndefined();
  });

  test('null or empty category', () => {
    expect(() => new model.stat(null, 2)).toThrow();
    expect(() => new model.stat({}, 2)).toThrow();
    expect(spy).not.toHaveBeenCalled();
  });

  test('in data.stats', () => {
    let cat = {stat_id: 1, title: "Fake Stat"};
    let oldStat = {};
    model.data.stats[1] = oldStat;
    model.data.active.add(1);

    expect(spy).not.toHaveBeenCalled();

    let stat = new model.Stat(cat, 3);

    expect(stat.category.stat_id).toEqual(1);
    expect(stat.category.title).toEqual("Fake Stat");
    expect(stat.weight).toEqual(3);
    expect(stat.enabled).toEqual(false);
    expect(stat.slider).toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(model.data.stats[1]).toBe(stat);
    expect(model.data.active.has(1)).toBeFalsy();
  });

  test('bad weight', () => {
    let cat = {stat_id: 1, title: "Fake Stat"};
    let oldStat = {};
    model.data.stats[1] = oldStat;
    model.data.active.add(1);

    expect(() => {new model.Stat(cat, -1)}).toThrow();
    expect(model.data.stats[1]).toBe(oldStat);
    expect(model.data.active.has(1)).toBeTruthy()
    expect(spy).not.toHaveBeenCalled();
  });

  test('new stat', () => {
    let cat = {stat_id: 1, title: "Fake Stat"};

    expect(spy).not.toHaveBeenCalled();
    expect(model.data.stats[1]).toBeUndefined();

    let stat = new model.Stat(cat, 3);

    expect(stat.category.stat_id).toEqual(1);
    expect(stat.category.title).toEqual("Fake Stat");
    expect(stat.weight).toEqual(3);
    expect(stat.enabled).toEqual(false);
    expect(stat.slider).toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(model.data.stats[1]).toBe(stat);
  });
});

describe("Stat.updateWeight", () => {
  beforeEach(() => {
    window.colorState = jest.fn(() => {});
    model.storage.reset();
    model.data.restored = true;
  });

  afterEach(() => {
    resetData();
    window.localStorage.clear();
    window.colorState.mockRestore();
  });

  //Note: all other tests mock other called functions
  test("enabled", () => {
    document.body.innerHTML = "<div id='slider'><input type='range' class='statistic-slider' value=2></input></div>";

    let slider = $("#slider");
    let input = $('.statistic-slider');
    let stat = {
      slider: slider,
      enabled: true,
      weight: 2,
      category: {
        stat_id: 4
      }
    };
    model.data.stats[4] = stat;

    expect(window.colorState).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(model.storage.ACTIVE_SLIDER_PREFIX+4)).toBeNull();

    model.Stat.prototype.updateWeight.apply(stat, [3]);

    expect(window.colorState.mock.calls.length).toEqual(50);
    expect(window.localStorage.getItem(model.storage.ACTIVE_SLIDER_PREFIX+4)).toEqual("3");
    expect(input.attr("value")).toEqual("3");
  });

  test("disabled", ()=> {
    document.body.innerHTML = "<div id='slider'><input type='range' class='statistic-slider' value=2></input></div>";

    let slider = $("#slider");
    let input = $('.statistic-slider');
    let stat = {
      slider: slider,
      enabled: false,
      weight: 2,
      category: {
        stat_id: 4
      }
    };
    model.data.stats[4] = stat;

    expect(window.localStorage.getItem(model.storage.ACTIVE_SLIDER_PREFIX+4)).toBeNull();

    model.Stat.prototype.updateWeight.apply(stat, [3]);

    expect(window.colorState).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(model.storage.ACTIVE_SLIDER_PREFIX+4)).toEqual("3");
    expect(input.attr("value")).toEqual("2");
  });

});


describe("Stat.enable", () => {
  let fakeSlider = {}
  beforeEach(() => {
    window.makeActiveSlider = jest.fn(() => fakeSlider);
  });

  afterEach(() => {
    resetData();
    window.makeActiveSlider.mockRestore();
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

describe("rankStates", () => {
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
    expect(script.rankStates(data).slice(0, 3)).toEqual(["AL", "AR", "OH"]);
  });

  test('missing states', () => {
    let script = require("../../public/javascripts/model");
    let data = {
      "AR": 2,
      "AL": 10,
      "OH": 1
    };
    expect(script.rankStates(data)).toEqual([]);
  });
});


describe('Stat show metadata', () => {
  var fetchedMetadata;

  beforeEach(() => {
    resetData();
    window.prepareMetadataAlert = jest.fn(() => {});
    window.showMetadataAlert = jest.fn(() => {});
    window.closeMetadataAlert = jest.fn(() => {});
    fetchedMetadata = [];
    window.getMetadata = jest.fn(async () => {return fetchedMetadata}); //TODO: Make a promise
  });

  test('happy path', () => {
    let metadata = {};
    model.data.metadataFetched = true;
    let stat = {metadata: metadata};
    model.Stat.prototype.showMeta.apply(stat);
    expect(window.prepareMetadataAlert).toHaveBeenCalled();
    expect(window.showMetadataAlert).toHaveBeenCalled();
    expect(window.closeMetadataAlert).not.toHaveBeenCalled();
    expect(window.getMetadata).not.toHaveBeenCalled();
  });

  test('fetch metadata', (done) => {
    let stat = {stat_id: 2};
    model.data.stats[2] = stat;
    fetchedMetadata = [{stat_id:2, note:{data:[]}}];
    model.Stat.prototype.showMeta.apply(stat);
    expect(window.prepareMetadataAlert).toHaveBeenCalled();
    expect(window.getMetadata).toHaveBeenCalled();
    expect(window.showMetadataAlert).not.toHaveBeenCalled();
    expect(window.closeMetadataAlert).not.toHaveBeenCalled();
    setTimeout(() => {
      try{
        expect(window.showMetadataAlert).toHaveBeenCalled();
        expect(window.closeMetadataAlert).not.toHaveBeenCalled();
        done();
      } catch (err){
        done(err);
      }
    }, 1);
  })
})
