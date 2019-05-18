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

    var membersHTML = [];
    var exMembersHTML = [];
    members.forEach(function(key) {
        if (key.active) {
            membersHTML.push(`<li>${key.name}&nbsp</li>`);
        }
        else if (!(key.active)) {
            exMembersHTML.push(`<li>${key.name}</li>`);
        }
        else {
            exMembersHTML.push(`<li>No ex members yet!</li>`);
        }
    });

    // str.indexOf(searchValue)
    var socialMediaHTML = [];
    var myURLs = [];

    social.forEach(function(key) {
        if (key.indexOf("facebook.com") > -1) {
            myURLs.push(key);
        }
    })

    var firstURL = myURLs.shift();
    return `
        <p>${details.profile}</p>
        <p>Name variations: <br>${details.namevariations}</p>
        Members: <ul id="members-list">${membersHTML}</ul>
        Ex-Members: <ul id="members-list">${exMembersHTML}</ul>
        Social: <p>${firstURL}</p>
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
