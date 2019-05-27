var releases_url;

function displayArtistInfo(artistData) {



    return `
      <img src="${artistData.thumb}" width="120" height="120" />
      <h2>${artistData.title}</h2>
        `;
}


function displayArtistDetails(details) {
    var members = [{}];
    var groups = [{}];
    var exMembersHTML = ["No ex-members"];
    var membersHTML = [];
    var groupsHTML = [];

    if (details.members) {
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
    if (details.groups) {
        membersHTML.push(`<li>&nbsp${details.realname}</li>`);
        groups = details.groups;
        groups.forEach(function(key) {
            if (key.active) {
                groupsHTML.push(`<li>&nbsp${key.name}</li>`);
            }    else if (!(key.active)) {
                groupsHTML.push(`<li>&nbspNone</li>`);
            }
        });
    }

    if (!(details.groups) && !(details.members)) {
        membersHTML.push(`<li>&nbsp${details.realname}</li>`);
        groupsHTML.push(`<li>&nbspNone</li>`);
      }

    var social = details.urls;
    // if (members.length == 0) {
    //     return `<div class="clearfix members-list">No members list!</div>`;
    // }





    var fbURLs = [];
    var twitURLs = [];

    social.forEach(function(key) {
        if (key.indexOf("facebook.com") > -1) {
            fbURLs.push(key);
        }
    })

    social.forEach(function(key) {
        if (key.indexOf("twitter.com") > -1) {
            twitURLs.push(key);
        }
    })

    var firstFbURL = fbURLs.shift();
    var firstTwitURL = twitURLs.shift();

    return `
        <p>${details.profile}</p>
        <h5>Name variations:</h5> <ul><li>&nbsp${details.namevariations}</li></ul>
        <h5>Members:</h5><ul>${membersHTML}</ul>
        <h5>Ex-Members:</h5> <ul>${exMembersHTML}</ul>
        <h5>Groups:</h5><ul>${groupsHTML}</ul>
        <h5>Social:</h5> <ul class="list-social"><li><a target="_blank" href="${firstFbURL}"> <i class="fab fa-facebook-square fa-2x"></i></a></li>
            <li><a target="_blank" href="${firstTwitURL}"><i class="fab fa-twitter-square fa-2x"></i><a></li>
      </ul>   `;
}



function fetchDiscogsData(event) {

    $("#dc-artist-data").html("");
    $("#dc-artist-details").html("");
    $("#data").html("");

    var artist = $("#dc-artist-inputbox").val();


    // $("#dc-artist-inputbox")
    //     .keyup(function() {
    //         var value = $(this).val();
    //         $("dc-artist-data").text(value);
    //     }).keyup();



    if (!artist) {
        $("#dc-artist-inputbox").html(`<h5>Enter an Artist</h5>`);
        return;
    }

    // $("#dc-artist-data").html(`<div id="loader"><img src="imgs/loader.gif" alt="loading..." /></div>`);

    $("#dc-artist-details").html(`<div class="text-center text-primary style="width: 3rem; height: 3rem;><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>`);

    $.when(
        $.getJSON(`https://api.discogs.com/database/search?type=artist&q=${artist}&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox`),
    ).then(
        function(response) {
            var artistData = response.results[0];
            $("#dc-artist-data").html(displayArtistInfo(artistData));

            var artistURL = artistData.resource_url;

            $.when($.getJSON(artistURL)).then(
                function(response2) {
                    var artistDetails = response2;
                    releases_url = response2.releases_url
                    $("#dc-artist-details").html(displayArtistDetails(artistDetails));
                }
            );
        },
        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#dc-artist-data").html(
                    `<h3>No info found for the artist ${artist}</h3>`);
            }
            else if (errorResponse.status === 403 || errorResponse.status === 429) {

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
