function displayArtistInfo(artistData) {
    artistData = artistData.results[0];
    // var artistURL = artistData.resource_url;

    return `
    
      <img src="${artistData.thumb}" width="80" height="80" />
      <h3>${artistData.title}</h3>

        `;
}

function displayArtistDetails(details) {

    var members = details.members;
    if (members.length == 0) {
        return `<div class="clearfix members-list">No members list!</div>`;
    }

    var membersHTML = [];
    members.forEach(function(key) {
        membersHTML.push(`<li>&nbsp${key.name}</li>`);
    });
  
    return `
        <p>${details.profile}</p>
        <p>Name variations: ${details.namevariations}</p>
        Members: <ul id="members-list">${membersHTML}</ul>
    `;

}


function fetchDiscogsData(event) {
    //  var artist = "11770";
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


            // JSON.parse(artistDetails.responseText);



            //     function(){
            //         if (this.readyState == 4 && this.status == 200) {
            //              JSON.parse(this.responseText);
            //             //  getArtistDetails(artistDetails);
            //             // return this;
            //             // document.getElementById("data").innerHTML = this.responseText;
            //             //   console.log(this);
            // }
            //     });
            // console.log(artistDetails);

            //   $.getJSON(`https://api.discogs.com/artists/${artistID}`)




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
