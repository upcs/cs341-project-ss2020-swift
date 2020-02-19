//SMAP Team
//Handle adding and updating sliders

"use strict";

var sliderContainer;
var selectionContainer;

$(document).ready(() => {
  sliderContainer = $("#slider_container");
  selectionContainer = $("#statistic_selector");
  addStat({id:10,title:"test stat"});
});


var stats = {};

const DEFAULT_WEIGHT = 3;

function Stat(category, weight){
  this.category = category;
  this.weight = weight;
  this.enabled = false;
  this.slider = null;
  this.disable();
}

Stat.prototype.updateWeight = function(weight){
  this.weight = weight;
  if (this.enabled){
    this.slider.value = weight;
  }
  console.log("Weight changed to " + this.weight);
  //Recompute weights and things
}

Stat.prototype.enable = function(){
  this.enabled = true;
  this.slider.remove();
  this.slider = makeActiveSlider(this.category.title, this.weight);

  //Add event listener
  $(".range_slider", this.slider).change((event) => {
    this.updateWeight(event.target.value);
  });
}

Stat.prototype.disable = function(){
  this.enabled = false;
  if (this.slider){
    this.slider.remove();
  }
  this.slider = makeInactiveSlider(this.category.title);

  //Add event listeners
  this.slider.click((event) => {this.enable()});
}

Stat.prototype.delete = function(){
  this.slider.remove();

}

function makeActiveSlider(title, weight){
  let slider = $(`
  <div class="statistic_setting_container">
    <div class="statistic_title">${title}</div>
    <div class="metadata_button">&#9432;</div>
    <input type="range" min="1" max="5" value="${weight}" class="range_slider" />
  </div>
  `);
  sliderContainer.append(slider);
  return slider;
}

function makeInactiveSlider(title){
  let slider  = $(`<div class="statistic_option">${title}</div>`);
  selectionContainer.append(slider);
  return slider;
}

function addStat(category){
  if (stats[category.id]){
    stats[category.id].delete();
  }
  let stat = new Stat(category, DEFAULT_WEIGHT);
  stats[category.id] = stat;
}
