//SMAP Team
//Handle adding and updating sliders as well as updating the map display
//The goal here is to ensure that the data and the HTML are always aligned

"use strict";

const DEFAULT_WEIGHT = 3; //The weight of a slider that is just made active
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
//This is the single source of truth - a change in these objects should be reflected
//  in a change in the HTML. Usage of the functions in this module should guarantee this.
var data = {active: new Set(), stats:{}};

//Used to initialize global variables
$(document).ready(() => {
  let active =  $("#active_slider_template");
  activeSliderTemplate = active.clone();
  activeSliderTemplate.removeAttr("id");
  active.remove();

  let inactive = $("#inactive_slider_template");
  inactiveSliderTemplate = inactive.clone();
  inactiveSliderTemplate.removeAttr("id");
  inactive.remove();

  sliderContainer = $("#statistics-sliders");
  selectionContainer = $("#statistics-selector");
  map = $("#us-map");

  //Gets list of categories and creates those sliders
  $.get("/api/cats", "", function(data, status, res){
    if (status !== "success"){
      console.log("Error getting categories");
      alert("AHHHH");
    } else {
      for (let cat of data){
        cat.title = cat.stat_name_short;
        new Stat(cat, DEFAULT_WEIGHT);
      }
    }
  });
});

function normalizeStats(row){
    let max = row["AL"];
    let min = max;

    //find the min and max values
    for (let state of states){
        max = Math.max(max, row[state]);
        min = Math.min(min, row[state]);
    }

    //Normalize, such that largest will always be 1 and smallest will always be 0
    let invert = row["invert_flag"] !== 0;
    max -= min;
    for (let state of states){
        row[state] = (row[state] - min) / max;
        if (invert){
          row[state] = 1 - row[state];
        }
    }
}

//A linerar way of handling the weights, such that the difference between slider values (the tick marks on client side)
//is the same ratio for 1 to 2 as it is for 3 to 4
//merely multiplying by the slider value meant a 50% increase for 1 to 2 but a 20% increase for 4 to 5
function calculateWeight(value){
  const ratio = 1.8;
  return Math.pow(ratio, value - 1);
}

//Reads the weights from the global data object and uses them to display the map.
function displayWeights(){
  //Sum up weights for each state
  let weights = {};
  let maxWeight = 0;
  for (let state of states){
    let weight = 0;
    for (let catID of data.active){
      let stat = data.stats[catID];
      if(stat.data){
        let stateData = stat.data[state];
        if(!stateData){
          //Data not present for this state, so bail
          weight = 0;
          break;
        }
        weight += calculateWeight(stat.weight) * stat.data[state];
      }
    }
    weights[state] = weight;
    maxWeight = Math.max(maxWeight, weight);
  }

  //Normalize and display
  for (let state of states){
    let weight = weights[state];
    // console.log(`State ${state} has weight ${weight}`);
    if (maxWeight != 0) weight /= maxWeight;
    $("#" + state, map).css("fill", mix_color(weight));
  }
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
  if(!sliderContainer){
    console.log("Document not yet ready");
    return;
  }
  if (data.stats[category.id]){
    delete data.stats[category.id];
    data.active.delete(category.id);
  }
  data.stats[category.id] = this;

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
  if (this.enabled){
    $(".statistic-slider", this.slider).attr("value", weight);
    displayWeights();
  }
}

//Called to make a statistic part of the SMAP calculation
//Moves the category to the active tab and adds a slider
Stat.prototype.enable = function(){
  this.enabled = true;
  data.active.add(this.category.id);
  this.slider.remove();
  this.slider = makeActiveSlider(this.category.title, this.weight);
  this.updateWeight(this.weight);
  data.active.add(this.category.id);

  //Add event listeners
  $(".statistic-slider", this.slider).change((event) => {
    this.updateWeight(Number(event.target.value));
  });

  $(".statistic-slider-remover", this.slider).click((event) => {
    this.disable();
  });

  //Fetches the data if we do not have it.
  if(!this.data){
    $.get("/api/data?cat=" + this.category.id, "", (data, status, xhr) => {
      if (status !== "success"){
        alert("AHHHHHHHHHHHH");
      } else {
        this.data = data[0];
        normalizeStats(this.data);
        // console.log(this.data);
        displayWeights();
      }
    });
  }
}

//Called to remove a statistic from the SMAP calculation
//Moves the category to the inactive tab and removes the slider
Stat.prototype.disable = function(){
  this.enabled = false;
  data.active.delete(this.category.id);
  if (this.slider){
    this.slider.remove();
  }
  this.slider = makeInactiveSlider(this.category.title);

  //Add event listeners
  this.slider.click((event) => {this.enable()});

  displayWeights();
}

//Deletes a statistic
Stat.prototype.delete = function(){
  this.slider.remove();
  data.active.remove(this.category.id);
  delete data.stats[category.id];
}

//Creates an active slider from the template and adds it to the page
function makeActiveSlider(title, weight){
  let slider = activeSliderTemplate.clone();
  $(".statistic-slider", slider).attr("value", weight);
  $(".statistic-slider-title", slider).html(title);
  sliderContainer.append(slider);
  return slider;
}

//Creates an inactive slider from the template and adds it to the page
function makeInactiveSlider(title){
  let slider = inactiveSliderTemplate.clone();
  $(".statistic-option-title", slider).html(title);
  selectionContainer.append(slider);
  return slider;
}

if(typeof module !== "undefined" && module.exports){
  module.exports = {
    Stat: Stat,
    DEFAULT_WEIGHT: DEFAULT_WEIGHT
  }
}
