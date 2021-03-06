# Milestone Project 2 – Interactive Frontend Development.
# Discogs demo web application

## Overview
This web app is a simple demonstration of manipulating the a public API to display tables of data with corresponding visualisations. The chosen API is that of Discogs.com, a website that catalogues music releases. 
A primary goal of the project was to try and use data that was not stored locally, instead retrieved form an external server.

The project is currently hosted on GitHub Pages and is available here: 
https://neillarkin.github.io/discogs-app/

## UX
The target user of the application is a potential employer. The application will be used to showcase some of my knowledge of using APIs, JSON JS2015 and D3/DC.js.
It is expected that the employer will only spend a few moments using the application and so it should appear simple and visually appealing. The UI is clean and responsive with no major functional bugs that would give a poor user experience. 

Wireframe:https://github.com/neillarkin/discogs-app/blob/master/wireframe/discogs.app.wireframe.JPG 

### Use case scenarios
The target use for this application is potential employers. A working version of the application will be displayed on my portfolio website along with the source code. The application will be used as part of an interview pitch to convey my knowledge of working with an API and other related technologies. 

## Features
The application has three main features: it allows a user to: Search for an artist; See a list of that artists releases; Visualise the audio format of those releases over time.
The layout is kept simple with one search box being the primary method of interaction. Users simply type the name of an artist and click the search button. The artist results immediately appear, with information such as an image, profile, members and social links. 
A paginated table of music releases by the artist is formatted to display specific columns of data describing each album release such as name, title, year etc. Each table of 50 items can be browsed by clicking ‘Next’ and ‘Previous’ buttons.
Two visualisations correspond to the currently displayed table of rows. The visualisations update as the user browses through the tables. A basic line graph and pie chart attempt to visualise the popularity in audio formats over time. Starting with analogue and progressing to digital formats. Each visualisation has some basic interactivity provided by the DC.js framework.

## Features to implement
- The home page or landing page is currently blank and is set to default to a search for Nirvana. The home page could be set to display and array of album covers.
It may be possible to make the SVGs responsive. This would require some more research.
- The searchbox should accept a key press on the ‘Enter’ key to perform a search.
- Some of the items in the table rows could be hyperlinked to launch Boostrap modals.
- The top-half of the web page could do with some cosmetic improvemnets.

## Technologies
JavaScript ES6/2015 – used for the Promise functions.
Jquery 3.4 – used div selecting and Promise functions 
DC.js 2.1 – used on top of D3 to generate both graphs
Crossfilter 1.3 – used for creating dimensions from data selections
Boostrap 4.3, HTML5 – for semantics and responsiveness



### Formatting the JSON objects
The Discogs.com public API returned and array called ‘results’ that contained objects of data in JSON. This object contained a property that was used to retrieve the artists album releases and place them into a table.
A problem was that each object was often different. Some objects keys had empty properties. To fix this, each object was lopped through and a new object created with missing keys replaced with properties such as ‘No data!’, ‘No Label’, and ‘No Year’. 
The data had to be cleaned further before generating the visualisations. Each objects was looped through and its ‘format’ property was compared to arrays of items used by the Discogs data. The include() function was used to compare and replace the property with either, Vinyl, Tape, Optical, MP3 or No Data. This made it easier for the Crossfilter reduceSum() functions to visualise the data.


## Testing
Test-driven development was implemented with the Jasmine testing framework. The recordSpec.js file runs two tests again the response XMLHttpRequest getData() function in the releases.js file. The first test simply verifies that an object has been returned. The second test checks the value for the ‘artist’ property of that object. A problem with this test was the Jasmine Describe functions were running before the getData() function was complete. A workaround was to implement a Timeout of 2000 ms inside the second Describe function. 

Other tests performed were against the main.js file and its errorResponses for 405, 500 and other statues codes. The web resource https://httpstat.us was inserted in to the getJSON request to help manually test if each of the status code responses were functioning correctly.

Manual testing was performed with Chrome on Windows, Chrome on Android, and Safari on iOS. The test cases were as below:
1) Type an artist name in to the search box and press the Search button.
	Verify Artist details appear.
	Verify artist releases appear table.
	Verify the Next and Previous buttons function.
	Verify the visualisations appear.
	Verify the the ‘format’ and ‘year’ table information match that of both 		visualisations.
	Verify the visualisations are interactive.
2) Type a non-existent artist name in to the search box and press the Search button.
	Verify that a message appears informing the user there is no artist.
3) Perform steps 1 and 2 with Safari on iOS
4) Perform steps 1 and 2 with Chrome on Android

 A user would perform a search then browse the table using the buttons. The data within the table rows was checked to see if it corresponded with the visualisations. The visualisations were then interacted with to see if any cosmetic errors occurred. Non-existing artists were also search for to see if the appropriate message was displayed.

### Bugs/Issues
1) The Discogs JSON response of paginated data, appears to go beyond the list of album releases for a particular artist; resulting in later paginations being unrelated to the original search. This is something that could be rectified by generating a new array of data that contains records that only included artist values that correspond to given string values.
2) Responsivity is significantly affected by the visualisations. This is mentioned in the project brief. Some sources on the web describe workarounds for manipulating the SVG to make it responsive. This is something that could be implemented in a future update to the application.
3) The social media links are not 100% accurate; simple concatenating the artist name to both the Facebook and Twitter URLs. It works more popular artists.
4) Hitting enter on the searchbox does not not perform a search. This could be implemented in a future update.
5) The 'Next' button often becomes misaligned with large pages.
6) The table is slightly too large on smart phones.

### Deployment
The sites was built on the Cloud9 IDE with GitHub used to backup milestones in development. The latest version is hosted on GitHub Pages ans is available here:
https://neillarkin.github.io/discogs-app/

#### Credits and Sources

- Visualisation.js Lines 11-17 – function to check 
https://stackoverflow.com/questions/37896484/multiple-conditions-for-javascript-includes-method 

- Lessons in Interactive Frontend Development

- Discogs API: www.discogs.com/developers/
