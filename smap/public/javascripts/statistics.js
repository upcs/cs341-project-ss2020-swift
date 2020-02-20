//SMAP Team
//Handle adding and updating sliders
//The goal here is to ensure that the data and the HTML are always aligned

"use strict";

const DEFAULT_WEIGHT = 3; //The weight of a slider that is just made active

//Global variables
var sliderContainer; //Where the active sliders are stored
var selectionContainer; //Where the inactive sliders are stored
var activeSliderTemplate; //The html template for an active slider
var inactiveSliderTemplate; //The html template for an inactive slider

//An object storing all statistics
//  active: a set of active category ids
//  stats: an object mapping category ids to Stat objects
//This is the single source of truth - a change in these objects should be reflected
//  in a change in the HTML
var data = {active: new Set(), stats:{}};

//Creates a statistic and places it in the stats object
function addStat(category){
  if(!sliderContainer){
    console.log("Document not yet ready");
    return;
  }
  if (data.stats[category.id]){
    data.stats[category.id].delete();
    data.active.delete(category.id);
  }
  let stat = new Stat(category, DEFAULT_WEIGHT);
  data.stats[category.id] = stat;
}

//Used to initialize global variables
$(document).ready(() => {
  activeSliderTemplate = $("#active_slider_template");
  activeSliderTemplate.removeAttr("id");
  inactiveSliderTemplate = $("#inactive_slider_template");
  inactiveSliderTemplate.removeAttr("id");

  sliderContainer = $("#slider_container");
  selectionContainer = $("#statistic_selector");

  //Example usage
  //addStat({id:10,title:"test stat"});
});

//Stat constructor
//  category - a category object, which must have a title
//  weight - The weight the stat has in calcuations if it is active
function Stat(category, weight){
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
    $(".range_slider", this.slider).attr("value", weight);
  }
}

//Called to make a statistic part of the SMAP calculation
//Moves the category to the active tab and adds a slider
Stat.prototype.enable = function(){
  this.enabled = true;
  this.slider.remove();
  this.slider = makeActiveSlider(this.category.title, this.weight);
  this.updateWeight(this.weight);
  data.active.add(this.category.id);

  //Add event listener
  $(".range_slider", this.slider).change((event) => {
    this.updateWeight(event.target.value);
  });
}

//Called to remove a statistic from the SMAP calculation
//Moves the category to the inactive tab and removes the slider
Stat.prototype.disable = function(){
  this.enabled = false;
  if (this.slider){
    this.slider.remove();
  }
  this.slider = makeInactiveSlider(this.category.title);

  //Add event listeners
  this.slider.click((event) => {this.enable()});
}

//Deletes a statistic
Stat.prototype.delete = function(){
  this.slider.remove();
}

//Creates an active slider from the template and adds it to the page
function makeActiveSlider(title, weight){
  let slider = activeSliderTemplate.clone();
  $(".range_slider", slider).attr("value", weight);
  $(".statistic_title", slider).html(title);
  sliderContainer.append(slider);
  return slider;
}

//Creates an inactive slider from the template and adds it to the page
function makeInactiveSlider(title){
  let slider = inactiveSliderTemplate.clone();
  slider.html(title);
  selectionContainer.append(slider);
  return slider;
}

if(module && module.exports){
  module.exports = {
    addStat: addStat
  }
}
