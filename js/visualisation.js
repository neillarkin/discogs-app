//loop through the each record objects 'format' property
//Then group each objects in to either Vinyl, Tape, Optical, MP3/streaming or No Info!
function cleanFormatItems(releases) {

    var conditions_vinyl = ['6', '7', '10', '12', 'LP', '2xLP', 'xLP', 'Flexi', 'Flexi-disc', 'Acetate'];
    var conditions_tape = ['Cass', '4-Trk', '8-Trk', 'VHS', 'Betacam', 'Mixtape', 'DCC', 'DAT', 'Reel'];
    var conditions_optical = ['CD', 'CDr', 'VCD', 'SACD', 'DVD', 'DVD-V', 'Minimax', 'Laserdisc', '2xCD'];
    var conditions_streaming = ['MP2', 'MP3', 'WMA', 'WAV', 'FLAC', 'ogg', 'MP3Sur', 'MPEG', 'DFF', 'DSF', 'AMR', 'ALAC', 'AAC', 'AIFC', 'AIFF', 'APE'];

    releases.forEach(function(record, format) {
        //use th einclude() function to replace replace the 'format'  key values.
        // https://stackoverflow.com/questions/37896484/multiple-conditions-for-javascript-includes-method
        function contains(target, pattern) {
            var value = 0;
            pattern.forEach(function(word) {
                value = value + target.includes(word);
            });
            return (value === 1)
        }   

        switch (true) {
            case record.format === undefined:
                return record.format = "No data!";

            case contains(record.format, conditions_vinyl):
                return record.format = "Vinyl";

            case contains(record.format, conditions_tape):
                return record.format = "Tape";

            case contains(record.format, conditions_optical):
                return record.format = "Optical";

            case contains(record.format, conditions_streaming):
                return record.format = "MP3";
            default:
                return record.format = "No data!";
        }
    })

    generateCharts(releases);
}


//generate a bar and a pie chart.
//the bar chart uses reduceSum with somecleaning on the returned data.
//the pie chart using reduceCount 
function generateCharts(releases) {

    var ndx = crossfilter(releases);

    var year_dim = ndx.dimension(dc.pluck('year'));

    var vinylPerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'Vinyl') {
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var tapePerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'Tape') {
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var opticalPerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'Optical') {
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var streamPerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'MP3') {
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var noInfoPerYear = year_dim.group().reduceSum(function(d) {
        if (d.format === 'No data!') {
            return Math.ceil((+d.year / 2) / 1000);
        }
        else {
            return 0;
        }
    });

    var colorScale = d3.scale.ordinal().domain(["Vinyl", "Tape", "Optical", "MP3", "No data!"])
        .range(['#436e7d', '#ffcd4d', '#4cc389', '#c1432e', '#dad9d6']);

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

    var format_dim = ndx.dimension(dc.pluck('format'));
    var total_formats_per_set = format_dim.group().reduceCount(dc.pluck('year'))

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
        .legend(dc.legend().x(125).y(120).itemHeight(15).gap(5));

    dc.renderAll();

}
