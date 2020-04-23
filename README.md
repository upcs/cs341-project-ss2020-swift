# SMAP!

#### State Map Analysis Program

### Software Engineering, Spring 2020

#### Authors:
Sarah Bunger,
Hayden Liao,
Meredith Marcinko,
Ryan Regier,
Philip Robinson

#### Load Times
Page load time / time until page operable. Both are in seconds and are an average of five trials on the swift-smap.appspot.com site. For load times from Sprint 4, see the acceptanceTests.txt file.

Firefox (Sprint 5): 3.7482 / 5.7482

Chrome (Sprint 5): 3.5930 / 5.5930

Safari (desktop) (Sprint 5): 0.4384 / 2.4384

Microsoft Edge (Sprint 5): 8.9920441 / 10.9920441

Note: Acceptance tests were performed on mobile versions of Safari and Edge. There is no method for accessing the console via mobile, so these times were not recorded.

# Sprint 5 Improvements

## Performance
The loading time measurements we previously reported were not entirely accurate because it stopped timing when the loading screen began fading out rather than when it ended - which increased the time until the user could access the website by another half a second. This meant a total of 3 seconds of animation, which was longer than the webpage took to ready. The primary performance improvement was thus speeding up the loading animation by 1 second to make this time more reasonable.

The next issue we noticed was that we have to send ajax requests for our map images to fix a standing bug. We also need to manipulate the DOM once the maps are loaded, so we were requesting the maps in the document.ready event listener. This lead to a delay where we had to wait for the document to load then wait for the maps to download in order for the page to finish loading. Instead, we request the maps (and, while we were at it, the category list) immediately and store their promises, but wait to resolve the promises until the DOM is ready. These requests used to have a delay around 0.2 seconds, which is now gone. There is now no practical delay between the document being ready and the loading being finished (excluding animation time).

## Peer Bug Fixes
Our peers reported two bugs (one was reported twice). One was that the social media buttons at the bottom of the page were nonfunctional (Issues 68 and 69). Since these were placeholders in case we had time to implement social media sharing, this bug was resolved by simply removing them. The other bug concerned the stat names, which would overflow their boxes and push subsequent names further down (Issue #46). This was resolved by adding in css attributes for text-wrapping as well as adaptive height for that grid-area.

## Cross-Browser Compatibility

The majority of our reported issues were related to cross-browser functionality. Safari handles sizing differently than most browsers, using an older method to interpret percentages. When the height of an item within a grid is defined by percentage, that percentage is of the entire screen size, not of the parent grid. Thus, specific styling had to be implemented for the statistics sidebar and alert windows in Safari, using vh instead of % for sizing.

A specific style sheet was also developed for users on mobile devices. 

### Known Issues

On Edge, state highlighting looks incorrect if you move your mouse very quickly (see #94).

On Safari, the Statistic Selection container does not utilize all vertical room possible.

Default mobile view does not show bottom bar with legend and theme selector.

## Significant Client-Side Bug Fixes

### Issue #41: Theme Race Condition

Chrome changed themes with a delay - the theme it displayed was always the previous theme you selected rather than the current. The issue came down to how we modified the DOM. Changing the html property required that the browser handle a page update asynchronously, at which point the map was already colored in. We changed this to modifying the DOM directly to fix the issue.

However, this issue had a rare resurgence where no theme would be displayed when the theme changed. When two alternate stylesheets were enabled at the same time, some browsers sometimes treated this like no stylesheet was enabled. We fixed this by mimicking an external example and disabling the active stylesheet before searching for the one to enable.

### Issue #57: Coloring Issues in Chrome

Although our map SVGs were linked with the ```<object>``` tag in the browser, Chrome does not download these maps until they are visible on the screen as an optimization. We were unable to force the maps to load without resorting to some hacks. As a workaround, we fetch the maps with AJAX and embed the maps directly into our document.

### Issue #58: Edge sliders

Edge sliders did not scale to fit the width assigned to it in the CSS grid. As it turns out, it took this width as a maximum. Instead, the width defaulted to 196px. Setting ```CSS width: auto``` fixed the problem, and this change was not even registered in the inspectors of other browsers.

### Issue #60 and #70: Fewer than two stats selected

This was simply adding relevant checks in the code, as well as a bit of CSS so we could style these cases slightly differently.

### Issue #66, #80, and #107: Scaling issues

Another bug for the alerts was that they would not resize with the browser window, so at certain (reasonably small) window sizes, users could not close the alerts. Adding an extra div and changing where certain aspects of the alert was defined helped to resolve this issue for Firefox and Chrome. Safari required extra wrangling; as mentioned in the cross-browser compatability section, Safari does not handle percentaces as units within a grid.  

The scaling issue mentioned in #107 related to the map. Safari's handling of size within grids, combined with the fact that we have two stylesheets (for horizontal and vertial layouts), caused the map to initially spill out of its container upon resize. As soon as the user moused over it, the proper map would render, one state at a time. This issue was resolved by switching to viewport measurements and removing ```CSS display: grid```.

## Test Coverage

[![Build Status](https://travis-ci.com/upcs/cs341-project-ss2020-swift.svg?branch=master)](https://travis-ci.com/upcs/cs341-project-ss2020-swift)

[![Code Coverage](https://codecov.io/gh/upcs/cs341-project-ss2020-swift/branch/master/graph/badge.svg)](https://codecov.io/gh/upcs/cs341-project-ss2020-swift)

The API Handler code that deals with requests is 100% covered by tests. The code that deals with maintaining the data model (model.js) is nearly at 100% coverage. To achieve these numbers, we have over two thousand lines of code for tests that cover a variety of cases. We made extensive use of mocks in order to isolate client side code and tested for a variety of edge cases (some of which our code was already checking for, some of which it was not). Below is a hand-picked assortment of our juiciest tests.

### Most Inventive Tests [TODO]
#### Stat.enable -> without data failed callback
Creating a Stat object using the constructor has some side effects (like updating the global data object) that we don't want to deal with. As such, we are using the ```apply()``` function to let us use a fake Stat object when testing this function. This particular test has another knot however, because we are supposed to test what happens when the get request fails. As such, we must mock the jQuery ```get()``` function to complete this test. Relevant code portions are below.

```javascript
$.get = jest.fn((url, blank, callback) => {
  callback([], "failure", null);
});
window.alert = jest.fn(() => {});

let rm = jest.fn(() => {});
let stat = {
  slider: {
    remove: rm
  },
  weight: 1,
  category: {
    title: "Fake Stat",
    stat_id: 7
  },
  updateWeight: jest.fn(() => {}),
};

//Precondition checks...

model.Stat.prototype.enable.apply(stat, []);

//Postcondition checks...

$.get.mockRestore();
window.alert.mockRestore();
```

#### restoreFromStorage -> null storage
There is a rare possibility that a browser does not support local storage, which we use for saving user state such as theme and selected statistics. We wanted to test to make sure we could handle this case gracefully. However, Jest's built-in browser supports local storage, and there is no obvious way to disable this functionality for a single test. The solution came in two parts. First, we put the code that set whether storage was available in a separate ```setStorage``` function. This function cannot be mocked using Jest alone because it resides in the same file. However, the Node module ```rewire``` can do exactly this. As a result, we mock the function to fail to set storage, allowing us to test the edge case where the browser is not allowed to save data. Note that ```rewire``` does not work perfectly with Jest - tests using it do not contribute to code coverage. Thus, our coverage report says this case is not covered even though it is.

But if you thought this test couldn't get any more interesting - you're in luck. Restoring from storage requires access to Stat objects, but we didn't want to create real ones to isolate this code. Thus, we create a new FakeStat object with mock functions that are used by ```restoreFromStorage``` so we can check which functions it calls and with what parameters. Some of this functionality was in the ```beforeEach``` and ```afterEach``` portions of the tests, but I have put it all together below so it's easy to read.

```javascript
function FakeStat(id){
  this.category = {stat_id: id};
  this.weight = model.DEFAULT_WEIGHT;
};
FakeStat.prototype.enable = jest.fn(function(){model.data.active.add(this.category.stat_id)});
FakeStat.prototype.disable = jest.fn(function(){model.data.active.delete(this.category.stat_id)});
FakeStat.prototype.updateWeight = jest.fn(function(weight){this.weight = weight});

model.data.stats[3] = new FakeStat(3);

let script = rewire(path);
let available = jest.fn(() => {});
script.__set__('setStorage', available);

let storage = window.localStorage;
storage.setItem(script.storage.ACTIVE_SLIDER_KEY, "3");

//Precondition checks...

script.storage.restore();

//Postcondition checks...

window.localStorage.clear();
```

#### Stat.showMeta -> fetchedMetadata
Our code is lazy, which means we don't query our API until we absolutely need to. This shows up in the ```showMeta()``` function, where the user is requesting to see metadata information, and we need to test what happens when we haven't asked the API for metadata yet. The function that handles this call is asynchronous, so even if we mock the function to return instantaneously the rest of the code is not run. As it turns out, setting a timeout of 1 ms is sufficient for Javascript to let the async handler to run and successfully test the code.

```javascript
fetchedMetadata = [{stat_id:2, note:{data:[]}}];
window.getMetadata = jest.fn(async () => {return fetchedMetadata});

let stat = {stat_id: 2};
model.Stat.prototype.showMeta.apply(stat);

//Testing for code not related to get request

setTimeout(() => {
  try{
    expect(window.showMetadataAlert).toHaveBeenCalled();
    expect(window.closeMetadataAlert).not.toHaveBeenCalled();
    done();
  } catch (err){
    done(err);
  }
}, 1);

```

#### showMetadataAlert -> metadata with no title
One issue we could run into when trying to show a metadata alert is not having the metadata available. When the title is missing from the metadata, this test
ensures that the error is handled gracefully. A specific error message will be printed to the "#metadata-title" div for the user to see from the front end. A simple refresh should fix this issue. 

```javascript
  let metadata =
  {
  publication_date: "publication date",
  note: "note",
  source: "source",
  original_source: "original source"
  }

  expect($("#metadata-title").text()).toBe("init title text");
  expect($("#metadata-date").text()).toBe("init date text");
  expect($("#metadata-notes").text()).toBe("init notes text");
  expect($("#metadata-publisher").text()).toBe("init publisher text");

  expect($("#loading-div").hasClass("hidden")).toBe(false);
  expect($("#metadata-title").hasClass("hidden")).toBe(true);
  expect($(".metadata-alert-element").hasClass("hidden")).toBe(true);

  visuals.showMetadataAlert(metadata);

  expect($("#metadata-title").text()).toEqual(
      expect.stringContaining("Error"),
      expect.stringContaining("[Mm]etadata")
```

## Security
SMAP does not provide accounts, so the main security concern is the potential for SQL injections, which are prevented by parameterizing the database queries. There is also potential for denial of service (DOS) issues, though we will not address these for this project. For more information, go to tests > security_review.tx

## Error Handling [TODO]

# Features List:

## MVP Features:

### Statistic Sliders:
> Statistics can be selected from the "Statistics Selection" bank on the bottom left. They will
> become "active" and appear on the top left. These are the statistics that will be used to rank the
> states and color the map according to the key and color palette. You may chose to weight all
> statistics the same (default), or give them different weights depending on your preferences. This
> will likely not change the relative coloring very much, but it will change the coloring slightly.

### Dynamic Map Coloring:
> The most saturated states are the "best" states. The least saturated states are the "worst" states.
> This is according to the statistics that have been selected. There will always be a state completely
> saturated (colored) and a state completely unsaturated (white in light themes and black in dark themes.)

## Additional Features:

### State Window:
> The state window displays additional ranking and statistic information. The "rank" in the top left
> corner is the rank of the state (corresponding with the color) compared to all the other states
> *overall*. The "best" and "worst" statistics are those that the state ranks the highest/lowest in
> compared to the other states in those individual categories. Both comparisons are made based on what
> the user has selected. Additionally, the best/worst statistics have some more information about
> where they came from and when the data was collected.   

### Bar Chart
> In yet another display of similar information, the bar chart at the bottom of the state window shows
> how the state ranks compared to the other states overall. The state is highlighted, so it's easier
> to see. Not all the states are labelled on the bottom because there's not enough space.
> It is a known issue.   

### NE Magnifier:  
> In case your eyes are bad, we've built in a magnifying glass that works better than simply zooming
> in. Designed with touch screens in mind, clicking the magnifying glass in the top right corner
> brings up a popup with the same functionality as the main 50 states, just bigger. It includes the 11
> most Northeastern states.

### Metadata Template:   
> Some of us like to know where and when are data comes from. To find out more metadata on our
> statistics, click on the (i) icon on the right side of each of the statistic sliders. This will
> trigger a popup with more details on your data, similar to the state window.   

### Color Palette:  
> Different themes can be chosen by hovering over the paintbrush in the bottom right, and selecting a
> theme from the popup menu.   

# Requirements Adherence Report:

### Vision
> Our product meets the vision set forth by the introduction, an interactive map which is colored based on user     statistics input. We implemented a ranking system for each statistic, so the user can choose how much they want each statistic to factor into the states’ overall scores. We’ve also added an invert flag for negative statistics, so if a user selects “GDP,” states with higher GDP will be colored darker. However, if the user selects “Violent Crime Rate” then states with lower Violent Crime rate will be colored darker.

### Usability
> Our website is intended to be easy for the user to understand, and we believe we have achieved this by making all clickable elements hoverable and having self-explanatory pop-ups.

### Budget
> We have done a good job in not going over budget by carefully monitoring the GCloud platform server which is hosting our website. Obviously, we cannot afford to be online in perpetuity, but we have enough GCloud credit to certainly keep us online until the end of the semester. We were originally concerned about 3rd party licensing, but we ended up not using the libraries we had looked into before starting the project.

### Use Cases
> We have passed all of our use cases from the requirements document. Use Case 3.5 “Viewing Open Source Licenses and Site Information” says that “open source licenses and data credits” will be in the about section. Since we didn’t use any open source code, we do not need any open source licenses. We later changed our metadata design to include data credits in the metadata containers, so the data credits will also not be in the about section to avoid redundant information in the site. Additionally, many use cases reference the containers by the names “Statistic Settings” and “Statistic Selection”, but those names have been changed to “Your Selected Statistics” and “Available Statistics,” respectively, to improve clarity and user experience.

### User Interface
> The user interface meets the expectations set forth in the requirements document. We have also met the requirements set in the Software Interfaces section. We manually loaded the data obtained from Statista and cited the data appropriately in the metadata popup. We also used NodeJS, ExpressJS and Jest as intended. Some libraries were cited in the requirements document which a) shouldn’t have been in the requirements document and b) were not used in the final product.

### Performance Requirements
> We have met performance requirements set by the requirements document. Our website loads in under 5 seconds. It runs running on all major desktop browsers updated within the last year. We have tested Firefox, Google Chrome, Safari and the latest version of Microsoft Edge. The website server is always running because we never deploy broken code to the master branch and the webpage only runs off the master branch.

### Safety Requirements
> Our only safety requirement was to check the accuracy of our data before uploading it into our database. We did that.

### Security Requirement
> Our only security requirement was to address Denial of Service (DoS) errors. We imagined a DoS error would result from too many people or bots using the website at the same time or simply simultaneously refreshing the page. Since we are not the only ones with this particular data set on the internet, and our website is simply a visualization tool, we have decided that it is very unlikely that a) too many people use our website at the same time or b) someone tries to cause a DoS error by making too many website requests. In either case, however unlikely, we think the worst thing that would happen is that we use up our GCloud budget. A bad DoS attack would shut down the website before we are charged more than our credit allows, and the expected lifetime of the product is now less than a month. Given the short lifespan of our product and the unlikelihood of a DoS error, intentional or unintentional, we have not further addressed the issue.

### Code Quality [TODO]
> Our code is thoroughly commented, and unit tested. Our server side test coverage is _____ and our client side test coverage is ____. We have also taken great care to make our website intuitive to new users. This meets our software quality requirements. 	
