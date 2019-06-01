var url = releases_url;

// function Record(thumb, artist, title, year, format, label) {
//     this.thumb = thumb;
//     this.artist = artist;
//     this.title = title;
//     this.year = year;
//     this.format = format;
//     this.label = label;
// }


function getDataFromURL(url) {

    // url = releases_url;

    url = "https://api.discogs.com/artists/45/releases?per_page=50&page=1";
    // var releases = [{}];

    $.when($.getJSON(url)).then(
        function(response) {
            var releases = response.releases;
            visualizeData(releases);
        }
    );
}




function visualizeData(releases) {
cleanFormatItems(releases)

 console.log(releases)




}

function cleanFormatItems(releases){
    releases.forEach(function(record, format) {

        if (record.format === undefined) {
            record.format = "No Info";
        }
        
        var conditions_vinyl = ['6', '7', '10', '12', 'LP', '2xLP', 'xLP', 'Flexi', 'Flexi-disc', 'Acetate'];
        conditions_vinyl.forEach(function(word) {
            if (record.format.includes(word)) {
                record.format = "Vinyl";
            }
        });

        var conditions_tape = ['Cass', '4-Trk', '8-Trk', 'VHS', 'Betacam', 'Mixtape', 'DCC', 'DAT', 'Reel'];
        conditions_tape.forEach(function(word) {
            if (record.format.includes(word)) {
                record.format = "Casette";
            }
        });

        var conditions_optical = ['CD', 'CDr', 'VCD', 'SACD', 'DVD', 'DVD-V', 'Minimax', 'Laserdisc'];
        conditions_optical.forEach(function(word) {
            if (record.format.includes(word)) {
                record.format = "Optical";
            }
        });

        var conditions_streaming= ['MP2', 'MP3', 'WMA', 'WAV', 'FLAC', 'ogg', 'MP3Sur', 'MPEG', 'DFF', 'DSF', 'AMR', 'ALAC', 'AAC', 'AIFC', 'AIFF', 'APE'];
        conditions_streaming.forEach(function(word) {
            if (record.format.includes(word)) {
                record.format = "Streaming";
            }
        });

// return releases;
       
    console.log("Year: " + record.year + "  Format: " + record.format);
    }) 
}


// function chkFormat(conditions, format, result) {

//     conditions.forEach(function(word) {
//         if (format.includes(word)) {
//             result = "Vinyl";
//         }
//     });
//     return result;
// }
