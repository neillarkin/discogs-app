// var url = releases_url;
var url;

function Record(thumb, artist, title, year, format, label) {
    this.thumb = thumb;
    this.artist = artist;
    this.title = title;
    this.year = year;
    this.format = format;
    this.label = label;
}


// function getDataFromURL(url) {
//     url = releases_url;

//     // url = "https://api.discogs.com/artists/69866/releases?per_page=50&page=10"

//     // url = "https://api.discogs.com/artists/45/releases?per_page=50&page=1";
//     // var releases = [{}];

//     $.when($.getJSON(url)).then(
//         function(response) {
//             var releases = response.releases;
//             // console.log(releases)

//             cleanFormatItems(releases)
//         }
//     );
// }

function cleanFormatItems(releases) {

    var conditions_vinyl = ['6', '7', '10', '12', 'LP', '2xLP', 'xLP', 'Flexi', 'Flexi-disc', 'Acetate'];
    var conditions_tape = ['Cass', '4-Trk', '8-Trk', 'VHS', 'Betacam', 'Mixtape', 'DCC', 'DAT', 'Reel'];
    var conditions_optical = ['CD', 'CDr', 'VCD', 'SACD', 'DVD', 'DVD-V', 'Minimax', 'Laserdisc', '2xCD'];
    var conditions_streaming = ['MP2', 'MP3', 'WMA', 'WAV', 'FLAC', 'ogg', 'MP3Sur', 'MPEG', 'DFF', 'DSF', 'AMR', 'ALAC', 'AAC', 'AIFC', 'AIFF', 'APE'];

    releases.forEach(function(record, format) {

        // if (record.format === undefined) {
        //     record.format = "No data!";
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
                return record.format = "No data!";
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
                return record.format = "No data!";
                // console.log("NO DATA")
                // record.format = "NO DATA";
        }

        // console.log(contains(record.format, conditions_vinyl));
        // visualizeData(releases);
    })

    generateCharts(releases);
}


function generateCharts(releases) {
    console.log(releases)

    var ndx = crossfilter(releases);

    var year_dim = ndx.dimension(dc.pluck('year'));

    var vinylPerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'Vinyl') {
            //   console.log("Format: " + d.format + " Year: " + d.year)
            // console.log(Math.ceil((+d.year / 2) / 1000));
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var tapePerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'Tape') {
            // console.log("Format: " + d.format + " Year: " + d.year)
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var opticalPerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'Optical') {
            console.log("Line Graph.  Format: " + d.format + " Year: " + d.year)
            console.log("Line Graph: " + Math.ceil((+d.year / 2) / 1000));

            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var streamPerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'MP3') {
            // console.log("Format: " + d.format + " Year: " + d.year)
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var noInfoPerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'No data!') {
            // console.log(d.format)
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var colorScale = d3.scale.ordinal().domain(["Vinyl", "Tape", "Optical", "MP3", "No data!"])
        .range(['#436e7d', '#ffcd4d', '#4cc389', '#c1432e', '#dad9d6']);

// tape '#ce9e62'

    var stackedChart = dc.barChart("#dataviz");
    stackedChart
        .width(660)
        .height(380)
        .dimension(year_dim)
        .transitionDuration(3000)
        .colors(colorScale)
        .group(vinylPerYear, "Vinyl")
        .stack(tapePerYear, "Tape")
        .stack(opticalPerYear, "Optical")
        .stack(streamPerYear, "MP3")
        // .stack(noInfoPerYear, "No data!")
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        // .xAxisLabel("Type of audio format released per year")
        .yAxisLabel("No. of Releases", "15")
        .legend(dc.legend().x(565).y(0).itemHeight(15).gap(5));

    stackedChart.margins().right = 100;
    stackedChart.margins().left = 60;

    // stackedChart
    //     .select("class", "x-axis-label")
    //     .attr("transform", "translate(71, 100)");



    // stackedChart.attr("transform", "translate(310,100")

    // stackedChart.select('class', x-axis-label).attr('transform', 'translate(310,100)')




    // var colorScale = d3.scale.ordinal().domain(["Vinyl", "Tape", "Optical", "MP3", "No data!"])
        // .range(['rgb(31, 119, 180)', 'rgb(255, 127, 14)', 'rgb(44, 160, 44)', 'rgb(214, 39, 40)', '#fff']);


    var format_dim = ndx.dimension(dc.pluck('format'));

    var total_formats_per_set = format_dim.group().reduceCount(dc.pluck('year'))




// Deep rusted red: #c1432e
// Silver head-dress: #4b6777
// Rusted Gold: #ce9e62
// Black for Contrast: #2c2c2c

    var pieChart = dc.pieChart('#dataviz2')
    pieChart
        .height(330)
        .radius(270)
        .innerRadius(75)
        .externalLabels(0)
        .transitionDuration(6000)
        .dimension(format_dim)
        .group(total_formats_per_set)
        .colors(colorScale)
        // .colors(d3.scale.ordinal().range(['grey', 'rgb(255, 127, 14)', 'rgb(44, 160, 44)', 'rgb(31, 119, 180)', 'rgb(214, 39, 40)']))
        .legend(dc.legend().x(125).y(120).itemHeight(15).gap(5));



    //   .legend(dc.legend().x(370).y(0).itemHeight(15).gap(5));

    // pieChart.  .attr('fill', function(d){ return(color(d.data.key)) })
    //   .attr("stroke", "black")
    //   .style("stroke-width", "2px")
    //   .style("opacity", 0.7)

    // pieChart.colors(function(d) { return colorScale(d.fruitType); });

    // pieChart.colors(colorScale);

    //   .colors(d3.scale.ordinal().range(['grey', 'orange', 'green', 'blue','red']))



    dc.renderAll();

}

// function generatePieChart(releases) {
//     var ndx = crossfilter(releases);


// }
