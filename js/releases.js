function getData(url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
        else if (this.status === 404) {
            $("#dc-artist-data").html(
                `<h5>Search for an artist... </h5>`);
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
            tableHeaders.push(`<th>&nbsp</th>`);
        }else{
            tableHeaders.push(`<th>${key}</th>`);
        }
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

function Record(thumb, artist, title, year, format, label) {

    // this.thumb = `<img src="./imgs/small-vinyl-record-mark.png">`;
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
    // $("#data").html(`<div class="text-center text-primary style="width: 3rem; height: 3rem;><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>`);


    getData(url, function(data) {
        var pagination = "";
        var pagData = data.pagination.urls;
        if (pagData.next || pagData.prev) {
            pagination = generatePaginationButtons(pagData.next, pagData.prev);
        }

        data = data.releases;

        data.forEach(function(record) {
            var rec = new Record(record.thumb, record.artist, record.title, record.year, record.format, record.label);
            // console.log(Object.keys(rec));
            // if (!(rec.key)) {
            //     // console.log("No Info!");
            //     rec.key = "No Info!";
            // };
            // if (rec.thumb) {

            //     return `<img src="./imgs/small-vinyl-record-mark.png">`;
            // }


            if (rec.thumb || rec.thumb == "" || rec.thumb === undefined) {
                rec.thumb = `<img src="./imgs/small-vinyl-record-mark.png">`;

                // return `<img src="./imgs/small-vinyl-record-mark.png">`;
            }



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

        // <img src="./imgs/small-vinyl-record-mark.png">
        cleanData.forEach(function(Record) {
            var dataRow = [];


            Object.keys(Record).forEach(function(key) {

                var rowData = Record[key].toString();


                var truncatedData = rowData.substring(0, 50);
                // console.log(truncatedData);

                dataRow.push(`<td>${truncatedData}</td>&nbsp`);
            });

            tableRows.push(`<tr>${dataRow}</tr>`);

        });
        var tableHeaders = getTableHeaders(cleanData[1]);

        el.innerHTML = `<table class="table-light table-striped" id="table-releases">${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");;
    });


}
