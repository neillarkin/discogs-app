//generic function to retirive data using a releases_url & a callback from writeToDocument()
function getData(url, callback){
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
        else if (this.status === 404) {
            $("#dc-artist-data").html(
                `<h5>Type an artist name in to the search field... </h5>`);
        }
    };

    xhr.open("GET", url);
    xhr.send();
}

//pass the releases_url for generating table
function getURL(){
    writeToDocument(releases_url);
}

//generate table headers
function getTableHeaders(obj){
    var tableHeaders = [];
    Object.keys(obj).forEach(function(key) {
        if (key == "thumb") {
            tableHeaders.push(`<th></th>`);
        }
        else {
            tableHeaders.push(`<th>${key}</th>`);
        }
    });
    return `<thead><tr class="text-uppercase">${tableHeaders}</tr></thead>`;
}

//generate pagination buttons
function generatePaginationButtons(next, prev){
    if (next && prev) {
        return `
        <div class="row no-gutters">
        <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-warning float-left" type="button" onclick="writeToDocument('${prev}')"><i class="fas fa-backward fa-2x"></i></button>
            <button type="button" class="btn btn-warning float-right" type="button" onclick="writeToDocument('${next}')"><i class="fas fa-forward fa-2x"></i></button>
        </div>
       </div>
        `;
    }
    else if (next && !prev) {
        return `
        <div class="row no-gutters">
        <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-warning float-right" type="button" onclick="writeToDocument('${next}')"><i class="fas fa-forward fa-2x"></i></button>
        </div>
       </div>
        `;
    }
    else if (!next && prev) {
        return `
        <div class="row no-gutters">
        <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-warning float-left" type="button" onclick="writeToDocument('${prev}')"><i class="fas fa-backward fa-2x"></i></button>
        </div>
       </div>
        `;
    }
}

//Record constructor
function Record(thumb, artist, title, year, format, label){
    this.thumb = thumb;
    this.artist = artist;
    this.title = title;
    this.year = year;
    this.format = format;
    this.label = label;
}


function writeToDocument(url){
    var tableRows = [];
    var cleanData = [{}];
    var el = document.getElementById("data");
    $("#data").html(`<div class="text-center text-primary style="width: 4rem; height: 4rem;><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>`);

    getData(url, function(data) {
        var pagination = "";
        var pagData = data.pagination.urls;
        if (pagData.next || pagData.prev) {
            pagination = generatePaginationButtons(pagData.next, pagData.prev);
        }

        //create a new cleaned JSON object to replace the missing parmenters on original retrieved object
        data = data.releases;
        data.forEach(function(record) {
            var rec = new Record(record.thumb, record.artist, record.title, record.year, record.format, record.label);

            if (rec.thumb || rec.thumb == "" || rec.thumb === undefined) {
                rec.thumb = `<img src="./imgs/small-vinyl-record-mark.png">`;
            }

            if (rec.format === undefined) {
                rec.format = "No data!";
            }

            if (rec.label === undefined) {
                rec.label = "No label";
            }
            if (rec.year === undefined) {
                rec.year = "No year";
            }
            //push each new object in to an array
            cleanData.push(rec);
        });

        cleanData.forEach(function(Record) {
            var dataRow = [];
            Object.keys(Record).forEach(function(key) {
                var rowData = Record[key].toString();
                var truncatedData = rowData.substring(0, 50);
                dataRow.push(`<td>${truncatedData}</td>`);
            });
            tableRows.push(`<tr>${dataRow}</tr>`);
        });
        var tableHeaders = getTableHeaders(cleanData[1]);

        el.innerHTML = `${pagination}<table class="table-light table-striped" id="table-releases">${tableHeaders}${tableRows}</table>`.replace(/,/g, "");
        //pass the new object to visualization.js for more cleaning 
        cleanFormatItems(data);
    });


}
