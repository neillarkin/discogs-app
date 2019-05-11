function artistInformationHTML(artist) {
    return `
        <h3>${artist.name}
            <span class="small-name">
                (@<a href="${artist.html_url}" target="_blank">${artist.namevariations}</a>)
            </span>
        </h3>
        <div class="dc-content">
            <div class="dc-avatar">
                <a href="${artist.url}" target="_blank">
                    <img src="${artist.images}" width="80" height="80" alt="${artist.resource_url}" />
                </a>
            </div>
             <p>Members: ${artist.members} <br> Repos: ${artist.releases_url}</p>
        </div>`;
}

// 11770

function fetchDiscogsData(event) {
//  var artist = 11770;
    var artist = $("#dc-artistname").val();
    if (!artist) {
        $("#dc-artist-data").html(`<h3>Enter an Artist</h3>`);
        return;
    }

    $("#dc-artist-data").html(
        `<div id="loader">
            <img src="imgs/loader.gif" alt="loading..." />
        </div>`);
    $.when(
        $.getJSON(`https://api.discogs.com/artists/${artist}/releases`)
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
