function artistInformationHTML(artistData) {
    // console.log(artistData.members[0]);
    // console.log(Object.keys(artistData));
    
    Object.keys(artistData).forEach(function(key) {
        console.log(artistData[key])

    });
    
    return `
        <h3>${artistData.name}
            <span class="small-name">
                (<a href="${artistData.uri}" target="_blank">${artistData.name}</a>)
            </span>
        </h3>
        <div class="dc-content">
            <div class="dc-avatar">
                <a href="${artistData.url}" target="_blank">
                    <img src="${artistData.uri}" width="80" height="80" />
                </a>
            </div>
             <p>Members: ${artistData.members['name']} <br> <a href="${artistData.releases_url}">Releases</a></p>
        </div>`;
}

// 11770

function fetchDiscogsData(event) {
     var artist = "11770";
    // var artist = $("#dc-artistname").val();
    if (!artist) {
        $("#dc-artist-data").html(`<h3>Enter an Artist</h3>`);
        return;
    }

    $("#dc-artist-data").html(
        `<div id="loader">
            <img src="imgs/loader.gif" alt="loading..." />
        </div>`);
    $.when(
        $.getJSON(`https://api.discogs.com/artists/${artist}`)
    ).then(
        function(response) {
            var artistData = response;
            $("#dc-artist-data").html(artistInformationHTML(artistData));
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
}
