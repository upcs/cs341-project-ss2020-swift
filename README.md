# SMAP!

#### State Map Analysis Program

### Software Engineering, Spring 2020

#### Authors:
Sarah Bunger,
Hayden Liao,
Meredith Marcinko,
Ryan Regier,
Philip Robinson

#### Average Webpage Get Request Time: 2.264
#### Average Webpage Loading Time: 4.764

# Sprint 5 Improvements

## Performance
The loading time measurements we previously reported were not entirely accurate because it stopped timing when the loading screen began fading out rather than when it ended - which increased the time until the user could access the website by another half a second. This meant a total of 3 seconds of animation, which was longer than the webpage took to ready. The primary performance improvement was thus speeding up the loading animation by 1 second to make this time more reasonable.

The next issue we noticed was that we have to send ajax requests for our map images to fix a standing bug. We also need to manipulate the DOM once the maps are loaded, so we were requesting the maps in the document.ready event listener. This lead to a delay where we had to wait for the document to load then wait for the maps to download in order for the page to finish loading. Instead, we request the maps (and, while we were at it, the category list) immediately and store their promises, but wait to resolve the promises until the DOM is ready. These requests used to have a delay around 0.2 seconds, which is now gone. There is now no practical delay between the document being ready and the loading being finished (excluding animation time).

## Cross-Browser Compatibility [TODO]

## Significant Bug Fixes [TODO]



### Issue #41: Theme Race Condition and #57 Coloring Issues in Chrome [TODO]




## Test Coverage [TODO]

[![Build Status](https://travis-ci.com/upcs/cs341-project-ss2020-swift.svg?branch=master)](https://travis-ci.com/upcs/cs341-project-ss2020-swift)

[![Code Coverage](https://codecov.io/gh/upcs/cs341-project-ss2020-swift/branch/master/graph/badge.svg)](https://codecov.io/gh/upcs/cs341-project-ss2020-swift)

### Most Inventive Tests [TODO]

## Security
SMAP does not provide accounts, so the main security concern is the potential for SQL injections, which are prevented by parameterizing the database queries. There is also potential for denial of service (DOS) issues, though we will not address these for this project. For more information, go to tests > security_review.tx


## Peer Bug Fixes
Our peers reported two bugs (one was reported twice). One was that the social media buttons at the bottom of the page were nonfunctional (Issues 68 and 69). Since these were placeholders in case we had time to implement social media sharing, this bug was resolved by simply removing them. The other bug concerned the stat names, which would overflow their boxes and push subsequent names further down (Issue #46). This was resolved by adding in css attributes for text-wrapping as well as adaptive height for that grid-area.

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
