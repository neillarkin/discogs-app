// var url = releases_url;


function Record(thumb, artist, title, year, format, label) {
    this.thumb = thumb;
    this.artist = artist;
    this.title = title;
    this.year = year;
    this.format = format;
    this.label = label;
}


function getDataFromURL(url) {
    url = releases_url;

    // url = "https://api.discogs.com/artists/69866/releases?per_page=50&page=10"

    // url = "https://api.discogs.com/artists/45/releases?per_page=50&page=1";
    // var releases = [{}];

    $.when($.getJSON(url)).then(
        function(response) {
            var releases = response.releases;
            // console.log(releases)

            cleanFormatItems(releases)
        }
    );
}

function cleanFormatItems(releases) {

    var conditions_vinyl = ['6', '7', '10', '12', 'LP', '2xLP', 'xLP', 'Flexi', 'Flexi-disc', 'Acetate'];
    var conditions_tape = ['Cass', '4-Trk', '8-Trk', 'VHS', 'Betacam', 'Mixtape', 'DCC', 'DAT', 'Reel'];
    var conditions_optical = ['CD', 'CDr', 'VCD', 'SACD', 'DVD', 'DVD-V', 'Minimax', 'Laserdisc', '2xCD'];
    var conditions_streaming = ['MP2', 'MP3', 'WMA', 'WAV', 'FLAC', 'ogg', 'MP3Sur', 'MPEG', 'DFF', 'DSF', 'AMR', 'ALAC', 'AAC', 'AIFC', 'AIFF', 'APE'];

    releases.forEach(function(record, format) {

        // if (record.format === undefined) {
        //     record.format = "No Info";
        // }

        function contains(target, pattern) {
            var value = 0;
            pattern.forEach(function(word) {
                value = value + target.includes(word);
                // console.log(target + " : " + value)
            });
            return (value === 1)
        }

        switch (true) {
            case record.format === undefined:
                return record.format = "No Info!";
                // console.log(record.format);

            case contains(record.format, conditions_vinyl):
                // console.log(record.format);
                return record.format = "Vinyl";


            case contains(record.format, conditions_tape):
                return record.format = "Tape";
                // console.log(record.format);

            case contains(record.format, conditions_optical):
                return record.format = "Optical";
                // console.log(record.format);

            case contains(record.format, conditions_streaming):
                return record.format = "MP3";
                // console.log(record.format);
            default:
                return record.format = "No Info";
                // console.log("NO DATA")
                // record.format = "NO DATA";
        }

        // console.log(contains(record.format, conditions_vinyl));
        // visualizeData(releases);
    })

    visualizeData(releases);
}


function visualizeData(releases) {
    // console.log(releases)

    var ndx = crossfilter(releases);

    var name_dim = ndx.dimension(dc.pluck('year'));

    var vinylPerYear = name_dim.group().reduceSum(function(d) {
        if (d.format === 'Vinyl') {

            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    //   console.log("Format: " + d.format + " Year: " + d.year)

    var tapePerYear = name_dim.group().reduceSum(function(d) {
        if (d.format === 'Tape') {
            // console.log("Format: " + d.format + " Year: " + d.year)
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var opticalPerYear = name_dim.group().reduceSum(function(d) {
        if (d.format === 'Optical') {
            // console.log("Format: " + d.format + " Year: " + d.year)
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var streamPerYear = name_dim.group().reduceSum(function(d) {
        if (d.format === 'MP3') {
            // console.log("Format: " + d.format + " Year: " + d.year)
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var noInfoPerYear = name_dim.group().reduceSum(function(d) {
        if (d.format === 'No Info') {
            // console.log(d.format)
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var stackedChart = dc.barChart("#dataviz");
    stackedChart
        .width(700)
        .height(500)
        .dimension(name_dim)
        .group(vinylPerYear, "Vinyl")
        .stack(tapePerYear, "Tape")
        .stack(opticalPerYear, "Optical")
        .stack(streamPerYear, "MP3")
        // .stack(noInfoPerYear, "No Info")
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Type of audio format released per year")
        .yAxisLabel("No. of Releases", "15")
        .legend(dc.legend().x(630).y(0).itemHeight(15).gap(5));

    stackedChart.margins().right = 100;
    stackedChart.margins().left = 60;
    // stackedChart.yAxis().tickFormat(d3.format(".0s")));
    // stackedChart.valueAccessor(function(d) { return d.value; });

    // stackedChart.yAxis().formatNumber(d3.format(".2%"))
    // stackedChart.yAxis().tickValues(function(d){d.format})
    // stackedChart.title("Evolution of audio formats over time")

    dc.renderAll();




}
