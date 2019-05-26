function getData(url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
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

        tableHeaders.push(`<th>${key}</th>`);
    });

    return `<thead><tr class="text-uppercase">${tableHeaders}</tr></thead>`;

}

function generatePaginationButtons(next, prev) {
    // console.log("next: " + next +"  Prev: "+ prev);
    if (next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    }
    else if (next && !prev) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`;
    }
    else if (!next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`;
    }
}

function Record(artist, title, year, format, label) {
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
    $("#data").html(`<div id="loader"><img src="imgs/loader.gif" alt="loading..." /></div>`);

    getData(url, function(data) {
        var pagination = "";
        var pagData = data.pagination.urls;
        if (pagData.next || pagData.prev) {
            pagination = generatePaginationButtons(pagData.next, pagData.prev);
        }

        data = data.releases;

        data.forEach(function(record) {
            var rec = new Record(record.artist, record.title, record.year, record.format, record.label);
              // console.log(Object.keys(rec));
            // if (!(rec.key)) {
            //     // console.log("No Info!");
            //     rec.key = "No Info!";
            // };


            if (rec.format === undefined) {
                rec.format = "No format";
            }
            if (rec.label === undefined) {
                rec.label = "No label";
            }
            if (rec.year === undefined) {
                rec.year = "No year";
            }

            cleanData.push(rec);

        });


        cleanData.forEach(function(Record) {
            var dataRow = [];


            Object.keys(Record).forEach(function(key) {

                var rowData = Record[key].toString();
                // console.log(rowData);

                var truncatedData = rowData.substring(0, 40);

                dataRow.push(`<td>${truncatedData}</td>&nbsp`);
            });

            tableRows.push(`<tr>${dataRow}</tr>`);

        });
        var tableHeaders = getTableHeaders(cleanData[1]);

        el.innerHTML = `<table class="table-light table-striped" id="table-releases">${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");;
    });


}

