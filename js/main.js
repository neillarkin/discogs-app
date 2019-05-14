var artistDetails;

function getArtistDetails(artistURL) {
    //  var artistDetails;

    $.when(
            $.getJSON(artistURL))
        .done(
            function(data) {
                artistDetails = data;
                return artistDetails;
            });
    // return artistDetails;

}



function artistInformationHTML(artistData) {
    artistData = artistData.results[0];
    var artistURL = artistData.resource_url;

    getArtistDetails(artistURL);
    console.log(artistDetails);

    // artistDetails = artistDetails.members;
    //   <button onclick="writeToDocument('https:   //api.discogs.com/artists/${artistData.id}/releases')">Releases</button>  
    // console.log(artistData.id);
    // console.log(artistData[0]);
    // Object.keys(artistData).forEach(function(key) {
    //         console.log(artistData.releases_url);
    //          console.log(Object.keys(artistData));
    // });

    // console.log(artistData.id);

    return `
    
      <img src="${artistData.thumb}" width="80" height="80" />
      <h3>${artistData.title}</h3>
        <p>${artistDetails.profile}</p>
        <p>Name variations: ${artistDetails.namevariations}</p>
         <p>Artist URLs: ${artistDetails.urls}</p>
        
        `;
}

// 11770
// https://api.discogs.com/database/search?type=artist&q=${artist}&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox
// https://api.discogs.com/artists/69866





function fetchDiscogsData(event) {
    //  var artist = "11770";
    var artist = $("#dc-artist-inputbox").val();
    if (!artist) {
        $("#dc-artist-data").html(`<h3>Enter an Artist</h3>`);
        return;
    }

    $("#dc-artist-data").html(`<div id="loader"><img src="imgs/loader.gif" alt="loading..." /></div>`);

    $.when(
        $.getJSON(`https://api.discogs.com/database/search?type=artist&q=${artist}&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox`)

    ).then(
        function(response) {
            var artistData = response;


            //   $.getJSON(`https://api.discogs.com/artists/${artistID}`)


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
