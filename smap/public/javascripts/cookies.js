//Team SMAP
//Store cookies that will save the state of sliders
//This will let us restore the last set state of the map when the user
//    leaves the page

"use strict";

/*
  Cookie format:
  active_sliders = cat1,cat2,cat3;
  slider_cat1 = value1;
  slider_cat2 = value2;
  slider_cat3 = value3;
*/

var storage = Window.localStorage;

/*
  Called when document loaded.
  Reads cookies.
  Set window configuration to these settings.

  Arguments: none
  Return: a boolean that is true exactly when a valid cookie is found and restored from
*/
function restoreFromCookies(){
  let sliders = storage.getItem('active_sliders');
  if (sliders) {
    let cats = sliders.split(",");
    for (let cat of cats){
      let stat = data.stats[cat];
      if (stat instanceof Stat){
        stat.enable();
        let value = Number(storage.getItem(`slider_${cat}`));
        if (value && value >= MIN_WEIGHT && value <= MAX_WEIGHT){
          stat.updateWeight(value);
        }
      }
    }
  }
}

/*
  Called to update list of active categories.

  active: The set of active category ids.
*/
function updateCategories(active){
  //Stores update list
  let active = data.active.values();
  let activeArr = Array.from(active);
  storage.setItem('active_sliders', activeArr.join(","));
}

/*
  Called to store the weight for a category.

  cat: A category id.
  value: The weight of cat. Setting to a negative value will delete the category.
*/
function storeWeight(cat, value){
  if (value < 0){
    storage.removeItem(`slider_${cat}`);
  } else {
    storage.setItem(`slider_${cat}`, value);
  }
}
