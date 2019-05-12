function artistInformationHTML(artistData) {

    artistData = artistData.results[0];
    // console.log(artistData.id);
    // console.log(artistData[0]);
    // Object.keys(artistData).forEach(function(key) {
    //         console.log(artistData.releases_url);
    //          console.log(Object.keys(artistData));
    // });

    return `
      <h3>${artistData.id}

        </h3>
      <h3>${artistData.title}
        </h3>
      
        
        
        `;
}

// 11770
// https://api.discogs.com/database/search?type=artist&q=${artist}&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox

function fetchDiscogsData(event) {
    //  var artist = "11770";
    var artist = $("#dc-artistname").val();
    if (!artist) {
        $("#dc-artist-data").html(`<h3>Enter an Artist</h3>`);
        return;
    }
    
    // curl "https://api.discogs.com/database/search?q=Nirvana&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox"
    $("#dc-artist-data").html(
        `<div id="loader">
            <img src="imgs/loader.gif" alt="loading..." />
        </div>`);
    $.when(
        $.getJSON(`https://api.discogs.com/database/search?type=artist&q=${artist}&token=nBvZlBkjrlXGhxDUpVYiOKeRNHUdsBYffuasXHox`)
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
