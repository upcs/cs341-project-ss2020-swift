# SMAP!

Authors:\
Sarah Bunger,
Hayden Liao,
Meredith Marcinko,
Ryan Regier,
Philip Robinson,

### Software Engineering, Spring 2020

#### Average Webpage Get Request Time: 2.264
#### Average Webpage Loading Time: 4.764

# Features List:

## MVP Features:

### Statistic Sliders:
Statistics can be selected from the "Statistics Selection" bank on the bottom left. They will\
become "active" and appear on the top left. These are the statistics that will be used to rank the\
states and color the map according to the key and color palette. You may chose to weight all\
statistics the same (default), or give them different weights depending on your preferences. This\
will likely not change the relative coloring very much, but it will change the coloring slightly.\

### Dynamic Map Coloring:
The most saturated states are the "best" states. The least saturated states are the "worst" states.\
This is according to the statistics that have been selected. There will always be a state completely\
saturated (colored) and a state completely unsaturated (white in light themes and black in dark themes.)\

## Additional Features:

### State Window:
The state window displays additional ranking and statistic information. The "rank" in the top left\
corner is the rank of the state (corresponding with the color) compared to all the other states\
*overall*. The "best" and "worst" statistics are those that the state ranks the highest/lowest in\
compared to the other states in those individual categories. Both comparisons are made based on what\
the user has selected. Additionally, the best/worst statistics have some more information about\
where they came from and when the data was collected.   

### Bar Chart
In yet another display of similar information, the bar chart at the bottom of the state window shows\
how the state ranks compared to the other states overall. The state is highlighted, so it's easier\
to see. Not all the states are labelled on the bottom because there's not enough space. \
It is a known issue.   

### NE Magnifier:  
In case your eyes are bad, we've built in a magnifying glass that works better than simply zooming\
in. Designed with touch screens in mind, clicking the magnifying glass in the top right corner\
brings up a popup with the same functionality as the main 50 states, just bigger. It includes the 11\
most Northeastern states.

### Metadata Template:   
Some of us like to know where and when are data comes from. To find out more metadata on our\
statistics, click on the (i) icon on the right side of each of the statistic sliders. This will\
trigger a popup with more details on your data, similar to the state window.   

### Color Palette:  
Different themes can be chosen by hovering over the paintbrush in the bottom right, and selecting a\
theme from the popup menu.   

[![Build Status](https://travis-ci.com/upcs/cs341-project-ss2020-swift.svg?branch=master)](https://travis-ci.com/upcs/cs341-project-ss2020-swift)

[![Code Coverage](https://codecov.io/gh/upcs/cs341-project-ss2020-swift/branch/master/graph/badge.svg)](https://codecov.io/gh/upcs/cs341-project-ss2020-swift)
