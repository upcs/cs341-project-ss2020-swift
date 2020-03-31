# SMAP!

Sarah Bunger
Hayden Liao
Meredith Marcinko
Ryan Regier
Philip Robinson

Software Engineering, Spring 2020

[![Build Status](https://travis-ci.com/upcs/cs341-project-ss2020-swift.svg?branch=master)](https://travis-ci.com/upcs/cs341-project-ss2020-swift)

[![Code Coverage](https://codecov.io/gh/upcs/cs341-project-ss2020-swift/branch/master/graph/badge.svg)](https://codecov.io/gh/upcs/cs341-project-ss2020-swift)

Title: Site loading and consistency of aesthetics.
Description: Ensuring that the “Loading Assets…” screen appears with proper animation. Also, 
this is a test to note any different aesthetics.
Expected Result: The dots in the loading screen bounce up and down until the site itself has 
loaded. There will be a reasonable amount of space for the empty statistic containers.
Actual Result: 
-	Firefox: There is very little empty space in the “Statistic Selection” section when all of the statistics are active, which makes it hard to tell that all the statistics are actually gone, especially that scrolling down causes the entire sidebar to slide off-screen. Also, statistic boxes are not dynamic, so some of the names spill out of the box.
-	Chrome: Same as Firefox.
-	Safari (desktop): When the “Statistic Settings” box is empty, the grey area below it is very small. Statistic boxes are not dynamic, so some of the names spill out of the box.
-	Safari (mobile): Same as desktop Safari.

Title: Applying a filter to the map.
Description: A filter is added to the map by clicking on a slider.
Expected Result: The filter moves from the “Statistic Selection” box to the “Statistic Settings” 
box. The map becomes colored, with different states as different colors. When the cursor is on a state, that state is highlighted a slightly brighter color and has a thicker border.
Actual Result: 
-	Firefox: As expected.
-	Chrome: As expected.
-	Safari (desktop): As expected.
-	Safari (mobile): As expected.

Title: Selecting a theme color.
Description: A theme color is applied to the map, after a statistic has already been selected.
Expected Result: The user selects a theme from the menu that appears when hovering over the 
paint roller icon. The map, sliders, slider headings, and best/worst indicator change colors.
Actual Result:
-	Firefox: As expected.
-	Chrome: Sliders, slider headings, and best/worst indicator will all update properly. The map, however, lags behind by one theme.
-	Safari (desktop): Same as Chrome.
-	Safari (mobile): Same as Chrome.

Title: Remembering the last session.
Description: Reloading the page will not reset the sliders.
Expected Result: When the user reloads the page, the previously selected sliders will appear (and 
the map will be colored accordingly). Note that current code does not retain theme info, but does apply to weights.
Actual Result:
-	Firefox: As expected. 
-	Chrome: As expected.
-	Safari (desktop): As expected.
-	Safari (mobile): As expected.

Title: Applying multiple filters.
Description: More than one filter is applied.
Expected Result: The map colors change slightly based on the newly added statistic. The slider 
moved from “Statistic Selection” to “Statistic Settings.” The theme color did not change.
Actual Result:
-	Firefox: As expected.
-	Chrome: As expected
-	Safari (desktop): As expected.
-	Safari (mobile): As expected.

Title: Defining weights when multiple filters are selected.
Description: The slider value is moved from its normal place (3) to a different value.
Expected Result: The map will update its colors, either slightly or a lot, depending on if the 
slider was moved by one unit or multiple.
Actual Result:
-	Firefox: As expected.
-	Chrome: As expected.
-	Safari (desktop): As expected.
-	Safari (mobile): As expected.

Title: Viewing site information.
Expected Result: Scrolling all the way down or clicking on the downward arrow shows the user a 
brief description of the SMAP website. As the site scrolls down, the sidebar with the 
statistics is pushed to the left and eventually completely off-screen.
Actual Result:
-	Firefox: As expected.
-	Chrome: As expected.
-	Safari (desktop): As expected.
-	Safari (mobile): As expected.

Title: Selecting all statistics.
Description: All ten of the available statistics are selected at once.
Expected Result: The map will update colors with each statistic added, and each will be added to the “Statistic Settings” section (and removed from “Statistic Selection”).
Actual Result:
-	Firefox: As expected. 
-	Chrome: As expected.
-	Safari (desktop): “Statistic Settings” area is not scrollable, so there are a few statistics that get pushed off-screen but can’t be clicked because the sidebar slides off-screen.
-	Safari (mobile): Same as desktop Safari, but worse because the screen is small.

Title: Removing all selected statistics.
Expected Result: Clicking the X on the left side of the slider updates the map color appropriately (or changes it to white if that was the only active statistic). The slider moves from “Statistic Settings” to “Statistic Selection.”
Actual Result:
-	Firefox: As expected.
-	Chrome: As expected.
-	Safari (desktop): As expected.
-	Safari (mobile): As expected.
