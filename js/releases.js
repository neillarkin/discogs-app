function getData(url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
        else if (this.status === 404) {
            $("#dc-artist-data").html(
                `<h5>Type an artist name in to the search field... </h5>`);
        }
    };

    xhr.open("GET", url);
    xhr.send();
}

function getURL() {
    writeToDocument(releases_url);
}

function getTableHeaders(obj) {
    var tableHeaders = [];

    // console.log(obj);

    Object.keys(obj).forEach(function(key) {
        // obj.thumb=="#";
        if (key == "thumb") {
            tableHeaders.push(`<th></th>`);
        }
        else {
            tableHeaders.push(`<th>${key}</th>`);
        }
    });

    return `<thead><tr class="text-uppercase">${tableHeaders}</tr></thead>`;
}

function generatePaginationButtons(next, prev) {
    if (next && prev) {
        return `
        <div class="row no-gutters">
        <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-warning float-left" type="button" onclick="writeToDocument('${prev}')">Previous</button>
            <button type="button" class="btn btn-warning float-right" type="button" onclick="writeToDocument('${next}')">Next</button>
        </div>
       </div>
        `;
    }
    else if (next && !prev) {
        return `
        <div class="row no-gutters">
        <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-warning float-right" type="button" onclick="writeToDocument('${next}')">Next</button>
        </div>
       </div>
        `;
    }
    else if (!next && prev) {
        return `
        <div class="row no-gutters">
        <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-warning float-left" type="button" onclick="writeToDocument('${prev}')">Previous</button>
        </div>
       </div>
        `;
    }
}

function Record(thumb, artist, title, year, format, label) {
    this.thumb = thumb;
    this.artist = artist;
    this.title = title;
    this.year = year;
    this.format = format;
    this.label = label;
}


function writeToDocument(url) {

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

        data = data.releases;
        // console.log(data)
        // console.log(data[0].artist);
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

            // console.log(cleanData)
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
        // getDataFromURL()

        el.innerHTML = `${pagination}<table class="table-light table-striped" id="table-releases">${tableHeaders}${tableRows}</table>`.replace(/,/g, "");
        cleanFormatItems(data);
    });


}
