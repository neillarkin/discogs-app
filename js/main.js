function displayArtistInfo(artistData) {
    artistData = artistData.results[0];
    return `
      <img src="${artistData.thumb}" width="80" height="80" />
      <h3>${artistData.title}</h3>
        `;
}



function displayArtistDetails(details) {
    var members = details.members;
    var social = details.urls;
    var artistName = details.name;
    // if (members.length == 0) {
    //     return `<div class="clearfix members-list">No members list!</div>`;
    // }


    var exMembersHTML = ["No ex-members"];
    var membersHTML = [];
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
        Name variations: <ul>${details.namevariations}</ul>
        Members: <ul>${membersHTML}</ul>
        Ex-Members: <ul>${exMembersHTML}</ul>
        Social: <ul><li><a target="_blank" href="${firstFbURL}"> <i class="fab fa-facebook-square fa-2x"></i></a></li>
            <li><a target="_blank" href="${firstTwitURL}"><i class="fab fa-twitter-square fa-2x"></i><a></li>
      </ul>
      
    `;
}



function fetchDiscogsData(event) {
    var artist = $("#dc-artist-inputbox").val();
    if (!artist) {
        $("#dc-artist-data").html(`<h3>Enter an Artist</h3>`);
        return;
    }

    $("#dc-artist-data").html(`<div id="loader"><img src="imgs/loader.gif" alt="loading..." /></div>`);

    $.when(
        $.getJSON(`https://api.discogs.com/database/search?type=artist&q=${artist}&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox`),
    ).then(
        function(response) {
            var artistData = response;
            var artistURL = artistData.results[0].resource_url;
            $("#dc-artist-data").html(displayArtistInfo(artistData));

            $.when($.getJSON(artistURL)).then(
                function(response2) {
                    var artistDetails = response2;
                    $("#dc-artist-details").html(displayArtistDetails(artistDetails));
                }
            );
        },
        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#dc-artist-data").html(
                    `<h3>No info found for the artist ${artist}</h3>`);
            }
            else {
                console.log(errorResponse);
                $("#dc-artist-data").html(
                    `<h3>Error: ${errorResponse.responseJSON.message}</h3>`);
            }
        });
};
