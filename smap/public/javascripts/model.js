//SMAP Team
//Handle adding and updating sliders as well as updating the map display
//The goal here is to ensure that the data and the HTML are always aligned

"use strict";

const MIN_WEIGHT = 1;
const DEFAULT_WEIGHT = 3; //The weight of a slider that is just made active
const MAX_WEIGHT = 5;
const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
"ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
"MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR",
"PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];


//Global variables
var sliderContainer; //Where the active sliders are stored
var selectionContainer; //Where the inactive sliders are stored
var activeSliderTemplate; //The html template for an active slider
var inactiveSliderTemplate; //The html template for an inactive slider
var map; //The map SVG

//An object storing all statistics
//  active: a set of active category ids
//  stats: an object mapping category ids to Stat objects
//  restored: whether or not storage has been read to load active categories
//  ranks: the states in sorted order by global rank
//  metadataFetched: whether we have read metadata from the server
//This is the single source of truth - a change in these objects should be reflected
//  in a change in the HTML. Usage of the functions in this module should guarantee this.
var data = new Data();

function Data(){
  this.active = new Set();
  this.stats = {};
  this.restored = false;
  this.ranks = states.slice();
  this.metadataFetched = false;
  this.weights = {};
}

/*
  Updates all the stats objects in data with their metadata.
  Args:
    metadata - the metadata object returned from the server
*/
function setMetadata(metadata){
  if (!metadata){
    return;
  }
  for (let meta of metadata){
    let id = meta.stat_id;
    if(id in data.stats){
      data.stats[id].metadata = meta;
      /*External CITATION
      As it turns out, reading blobs is hard.
      https://stackoverflow.com/questions/3195865/converting-byte-array-to-string-in-javascript
      */
      meta.note = String.fromCharCode.apply(null, meta.note.data);
    }
  }
}

//Converts values into a range between 0 and 1
//Args:
//  row - a dictionary mapping states to numbers. (ex. stat_name_short)
//        in addition, there must be an invert_flag key, which should have value
//        0 to not invert and 1 otherwise.
function normalizeStats(row){
    let max = row["AL"];
    let min = max;

    //find the min and max values
    for (let state of states){
        max = Math.max(max, row[state]);
        min = Math.min(min, row[state]);
    }

    if (max === min && max == 0){
        return; //everything is already zero
    } else if(max===min){
        for (let state of states){
            row[state] = 0.5; //assign everything to be the middle value
        }
        return;
    }

    //Normalize, such that largest will always be 1 and smallest will always be 0
    let invert = row["invert_flag"] === 1;
    max -= min;

    for (let state of states){
        row[state] = (row[state] - min) / max;
        if (invert){
            row[state] = 1 - row[state];
        }
    }
}

//A more intuitive (exponential) way of handling the weights, such that the difference between slider values (the tick marks on client side)
//is the same ratio for 1 to 2 as it is for 3 to 4
//merely multiplying by the slider value meant a 50% increase for 1 to 2 but a 20% increase for 4 to 5
function calculateWeight(value){
  if(!Number.isInteger(value) || value<=0){
      console.error("<model.js><calculateWeight> Invalid slider value (must be int >= 1)");
      return 0;
  }
  const ratio = 1.8;
  return Math.pow(ratio, value - 1);
}

/*
  Gets information about a state needed to display the state window.
  Args:
    stateAbbr - the two letter abbreviation for a state
  Return:
    An array of objects that contain the following:
      id - a category id
      rank - the state's rank in this category
      value - the value of the data for this category and state
      name - the name of the category corresponding with id
    The array will be sorted by rank from best to worst. There will be an object
    in the array for every active category.
*/
function getStateInfo(stateAbbr){
  let arr = [];
  for (let cat of data.active){
    let stat = data.stats[cat];
    if ("rankings" in stat){
      let rank = stat.rankings.indexOf(stateAbbr) + 1;
      if (rank === 0){
        console.error("State not found in category " + cat);
      } else {
        arr.push({
          id: cat,
          rank: rank,
          value: stat.data[stateAbbr],
          name: stat.category.title
        });
      }
    } else {
      console.error("Rankings not found on active category " + cat);
    }
  }
  arr.sort((first, second) => {
    return first.rank - second.rank;
  });
  return arr;
  //[{id:categoryID, rank:stateRank, value:stateValue, name:stat.data[id]}]
}

function rankStats(data){
  let ranks = states.slice();
  let error = false;
  ranks.sort((first, second) => {
    if (second in data && first in data){
      return data[second] - data[first];
    } else {
      console.log("Data has no value for state " + first + " or " + second);
      error = true;
      return 0;
    }
  });
  return error ? [] : ranks;
}

//Reads the weights from the global data object and uses them to display the map.
function displayWeights(){
  //Sum up weights for each state
  let weights = data.weights;
  for (let state of states){
    let weight = 0;
    for (let catID of data.active){
      let localStat = data.stats[catID];

      // console.log("typeof(localStat[data]): " + typeof(localStat["data"]));
      if(typeof localStat !== 'undefined' && typeof localStat["data"] !== 'undefined'){ //if localStat["data"] is defined...

        let stateData = localStat.data[state];
        if(stateData === undefined){
          //Data not present for this state, so bail
          console.error("Data for state " + state + " stat " + localStat.category.title + " not found");
          weight = 0;
          break;
        }
        weight += calculateWeight(localStat.weight) * stateData;
      }
    }
    data.weights[state] = weight;
  }

  normalizeStats(weights);
  data.ranks = rankStats(weights);

  drawChart(weights, data.ranks);

  for (let state of states){
    let weight = data.weights[state];
    colorState(state, weight);
  }
}

/**
 *
 * @param state_id, string of 2 letter abbr
 * @return the rank, 1 indexed
 */
function getStateRank(state_id){
  //loop through the data.ranks ARRAY.
  //The index of the state that matches will be 1 less than the rank, since it's indexed at 0
  for (let i = 0; i<data.ranks.length; i++) {
    console.log("data.ranks[i]" + data.ranks[i]);
    if(data.ranks[i] == state_id){
      console.log("found it. Rank: " + i+1);
      return i+1;
    }
  }
  console.error("invalid state id or data.ranks does not have all the state abbs");
  return -1;
}

/*Stat constructor.
A Stat object is used to model both the HTML and the underlying data.
It is of the following form:
{
  category: A category object as returned from the server. It must have id and title attributes.
  weight: How much to weight this category when enabled.
  enabled: Whether to use this category to calculate weights.
  slider: A JQuery object for the slider (whether active or inactive).
  data: The data for the statistic - mapping from state abbreviations to numbers. May be undefined.
}
Constructor arguments:
 category - a category object, which must have a title
 weight - The weight the stat has in calcuations if it is active*/
function Stat(category, weight){
  if (data.stats[category.stat_id]){
    delete data.stats[category.stat_id];
    data.active.delete(category.stat_id);
  }
  data.stats[category.stat_id] = this;

  this.category = category;
  this.weight = weight;
  this.enabled = false;
  this.slider = null;
  this.disable();
}

//Called to change the weight of the statistic
//Updates the HTML to reflect this new weight
Stat.prototype.updateWeight = function(weight){
  this.weight = weight;
  updateWeightStorage(this.category.stat_id);
  if (this.enabled){
    $(".statistic-slider", this.slider).attr("value", weight);
    displayWeights();
  }
}

//Called to make a statistic part of the SMAP calculation
//Moves the category to the active tab and adds a slider
Stat.prototype.enable = function(){
  this.enabled = true;
  this.slider.remove();
  this.slider = makeActiveSlider(this.category.title, this.weight);
  this.updateWeight(this.weight);

  //Add event listeners
  $(".statistic-slider", this.slider).change((event) => {
    this.updateWeight(Number(event.target.value));
  });

  $(".statistic-slider-remover", this.slider).click((event) => {
    this.disable();
  });

  $(".statistic-slider-metadata", this.slider).click((e) => {
    e.preventDefault();
    this.showMeta();
  });

  updateCategoryStorage();

  //Fetches the data if we do not have it.
  if(!this.data){
    $.get("/api/data?cat=" + this.category.stat_id, "", (cat_data, status, xhr) => {
      if (status !== "success"){
        alert("<statistics.js> AHHHHHHH FAILURE!!!");
      } else {
        this.data = cat_data[0];
        this.rankings = rankStats(this.data);
        data.active.add(this.category.stat_id);
        // this.data is an object with all of the column names ["stat_id"], ["stat_name_short"], ["AL"], ["AK"], etc.
        normalizeStats(this.data);
        // console.log(this.data);
        displayWeights();
      }
    });
  } else {
    data.active.add(this.category.stat_id);
    displayWeights();
  }
}

//Called to remove a statistic from the SMAP calculation
//Moves the category to the inactive tab and removes the slider
Stat.prototype.disable = function(){
  this.enabled = false;
  data.active.delete(this.category.stat_id);
  if (this.slider){
    this.slider.remove();
  }
  this.slider = makeInactiveSlider(this.category.title);

  //Add event listeners
  this.slider.click((event) => {this.enable()});

  $(".statistic-option-metadata").click((e) => {
    e.preventDefault();
    this.showMeta();
  });

  updateCategoryStorage();
  displayWeights();
}

//Deletes a statistic
Stat.prototype.delete = function(){
  this.slider.remove();
  data.active.remove(this.category.stat_id);
  delete data.stats[category.stat_id];
}

Stat.prototype.showMeta = function(){
  prepareMetadataAlert();
  if (this.metadata){
    showMetadataAlert(this.metadata);
  } else if (!data.metadataFetched){
      let promise = getMetadata();
      promise.then((metadata) => {
        data.metadataFetched = true;
        if (metadata !== null){
          setMetadata(metadata);
          if (this.metadata){
            showMetadataAlert(this.metadata);
            return;
          }
        }
        closeMetadataAlert();
      });
  } else {
    //TODO: Empty alert for error case?
    closeMetadataAlert();
  }
};

//region storage

/*
  Storage format: (catN is the id of a category)
  active_sliders = cat1,cat2,cat3;
  slider_cat1 = value1;
  slider_cat2 = value2;
  slider_cat3 = value3;
  theme = ???
*/
const ACTIVE_SLIDER_KEY = "active_sliders";
const ACTIVE_SLIDER_PREFIX = "slider_";

//EXTERNAL CITATION:
//  The following code is from
//  https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

//EXTERNAL CITATION: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
var storage;
function setStorage(){
  storage = storageAvailable('localStorage') ? window.localStorage : null;
}

/*
  Called when document loaded.
  Reads local storage.
  Set window configuration to these settings.

  Arguments: none
  Side effects: sets data.restored to true
*/
function restoreFromStorage(){
  setStorage();
  if (storage) {
    let sliders = storage.getItem(ACTIVE_SLIDER_KEY);
    if (sliders) {
      let cats = sliders.split(",");
      for (let cat of cats){
        cat = Number(cat);
        let stat = data.stats[cat];
        if (stat){
          stat.enable();
          let value = Number(storage.getItem(ACTIVE_SLIDER_PREFIX + cat));
          if (value !== undefined && value >= MIN_WEIGHT && value <= MAX_WEIGHT){
            stat.updateWeight(value);
          }
        }
      }
    }
  } else {
    console.error("Cannot read from localStorage");
  }
  data.restored = true;
}

/*
  Called to update list of active categories based on data.active
*/
function updateCategoryStorage(){
  //Stores update list
  if (storage && data.restored){
    let active = data.active.values();
    let activeArr = Array.from(active);
    storage.setItem(ACTIVE_SLIDER_KEY, activeArr.join(","));
  }
}

/*
  Called to store the weight for a category. The value is found from the data
  global variable.

  Args:
    cat: A category id.

  Return: none
*/
function updateWeightStorage(cat){
  if (storage && data.restored){
    let stat = data.stats[cat];
    if (stat){
      let value = stat.weight;
      if (value < 0){
        storage.removeItem(ACTIVE_SLIDER_PREFIX + cat);
      } else {
        storage.setItem(ACTIVE_SLIDER_PREFIX + cat, value);
      }
    }
  }
}

//endregion


// For testing purposes. More details later
if(typeof module !== "undefined" && module.exports){
  module.exports = {
    Stat: Stat,
    data: data,
    Data: Data,
    DEFAULT_WEIGHT: DEFAULT_WEIGHT,
    storage: {
      available: storageAvailable,
      updateCategory: updateCategoryStorage,
      updateWeight: updateWeightStorage,
      restore: restoreFromStorage,
      reset: setStorage,
      ACTIVE_SLIDER_KEY: ACTIVE_SLIDER_KEY,
      ACTIVE_SLIDER_PREFIX: ACTIVE_SLIDER_PREFIX
    },
    normalizeStats: normalizeStats,
    calculateWeight: calculateWeight,
    getStateInfo: getStateInfo,
    rankStats: rankStats,
    setMetadata: setMetadata,
    displayWeights: displayWeights
  }
}
