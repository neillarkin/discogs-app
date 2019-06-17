var releases_url;

//display artist name and image
function displayArtistInfo(artistData){
    return `
      <img src="${artistData.thumb}" width="120" height="120" />
      <h2>${artistData.title}</h2>
        `;
}

//display artist profile, name variations, members etc.
function displayArtistDetails(details) {
    var members = [{}];
    var groups = [{}];
    var exMembersHTML = ["No ex-members"];
    var membersHTML = [];
    var groupsHTML = [];


    //display member(s) of the group.
    if (details.members){
        members = details.members;
        members.forEach(function(key) {
            if (key.active) {
                membersHTML.push(`<li>&nbsp${key.name}</li>`);
            }
            else if (!(key.active)) {
                var instance = exMembersHTML.indexOf("No ex-members")
                if (instance > -1) {
                    exMembersHTML.splice(instance, 1);
                }
                exMembersHTML.push(`<li>&nbsp${key.name}</li>`);
            }
        });
    }
    if (details.groups){
        membersHTML.push(`<li>&nbsp${details.realname}</li>`);
        groups = details.groups;
        groups.forEach(function(key) {
            if (key.active) {
                groupsHTML.push(`<li>&nbsp${key.name}</li>`);
            }
            else if (!(key.active)) {
                groupsHTML.push(`<li>&nbspNone</li>`);
            }
        });
    }

    if (!(details.groups) && !(details.members)) {
        membersHTML.push(`<li>&nbsp${details.realname}</li>`);
        groupsHTML.push(`<li>&nbspNone</li>`);
    }

    //create social media links
    var social = details.urls;
    var fbURLs = [];
    var twitURLs = [];

    social.forEach(function(key) {
        if (key.indexOf("facebook.com") > -1) {
            fbURLs.push(key);
        }
    });

    social.forEach(function(key) {
        if (key.indexOf("twitter.com") > -1) {
            twitURLs.push(key);
        }
    });

    var firstFbURL = fbURLs.shift();
    var firstTwitURL = twitURLs.shift();

    return `
        <p>${details.profile}</p>
        <h5>Name variations:</h5> <ul><li>&nbsp${details.namevariations}</li></ul>
        <h5>Members:</h5><ul>${membersHTML}</ul>
        <h5>Ex-Members:</h5> <ul>${exMembersHTML}</ul>
        <h5>Groups:</h5><ul>${groupsHTML}</ul>
        <h5>Social:</h5> <ul class="list-social"><li><a target="_blank" href="${firstFbURL}"> <i class="fab fa-facebook-square fa-3x"></i></a></li>
            <li><a target="_blank" href="${firstTwitURL}"><i class="fab fa-twitter-square fa-3x"></i><a></li>
      </ul>   `;
}

//get artist name and artist details
function fetchDiscogsData(event) {

    $("#dc-artist-data").html("");
    $("#dc-artist-details").html("");
    $("#data").html("");
    // $(".graph-title").html("");
    $("#dataviz").html("");
    $("#dataviz2").html("");

    var artist = $("#dc-artist-inputbox").val();

    if (!artist) {
        $("#dc-artist-inputbox").html(`<h5>Enter an Artist</h5>`);
        return;
    }

    $("#dc-artist-details").html(`<div class="text-center text-primary style="width: 6rem; height: 6rem;><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>`);

    // $.when($.getJSON(`https://httpstat.us/429`)  For Testing status codes

    //get artist data and then use one of its propetties(resource_url) to get the artists album releases

    $.when($.getJSON(`https://api.discogs.com/database/search?type=artist&q=${artist}&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox`), ).then(
        function(response){
            // console.log(response)
            if (!Array.isArray(response.results) || !response.results.length) {
                $("#dc-artist-data").html(
                    `<h3>No info found for the artist ${artist}</h3>`);

            }
            var artistData = response.results[0];
            $("#dc-artist-data").html(displayArtistInfo(artistData));

            var artistURL = artistData.resource_url;

            $.when($.getJSON(artistURL)).then(
                function(response2) {
                    var artistDetails = response2;
                    releases_url = response2.releases_url //store the releases_url for table later
                    $("#dc-artist-details").html(displayArtistDetails(artistDetails));

                    getURL(); //used to retirve the artist album releases for table in releases.js
                }
            );
        },
        function(errorResponse){
            if (errorResponse.status === 404 || errorResponse.status === 500) {
                $("#dc-artist-data").html(
                    `<h3>No info found for the artist ${artist}</h3>`);
            }
            else if (errorResponse.status === 429 || errorResponse.status === 403) {
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Remaining') * 1000);
                $("#dc-artist-data").html(`<h5>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h5>`);
            }
            else {
                console.log(errorResponse);
                $("#dc-artist-data").html(
                    `<h3>Error: ${errorResponse.responseJSON.message}</h3>`);
            }
        }

    );
};


$(document).ready(fetchDiscogsData);
