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

    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`);
    });
    // let myHeader = tableHeaders.shift(tableHeaders.shift());
    return `<tr class="text-uppercase">${tableHeaders}</tr>`;

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

function writeToDocument(url) {

    var tableRows = [];
    var el = document.getElementById("data");

    getData(url, function(data) {
        var pagination = "";
        var pagData = data.pagination.urls;
        if (pagData.next || pagData.prev) {
            pagination = generatePaginationButtons(pagData.next, pagData.prev);
        }

        data = data.releases;
        var tableHeaders = getTableHeaders(data[1]);

        data.forEach(function(item) {
            var dataRow = [];
            Object.keys(item).forEach(function(key) {
                if (item.status === undefined) {
                    return this;
                }

                var rowData = item[key].toString();
                var truncatedData = rowData.substring(0, 50);

                dataRow.push(`<td>${truncatedData}</td>`);
            });
            // var myRow = dataRow.shift(dataRow.shift());

            tableRows.push(`<tr>${dataRow}</tr>`);

        });
        el.innerHTML = `<table class="table-light table-striped" id="table-releases">${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");;
        removeColumns();

    });


}

// 0 1 2 6 8 10



function statusCol() { $('table tr').find('td:eq(0),th:eq(0)').remove(); };

function statsCol() { $('table tr').find('td:eq(0),th:eq(0)').remove(); };

function thumbCol() { $('table tr').find('td:eq(0),th:eq(0)').remove(); };

function roleCol() { $('table tr').find('td:eq(3),th:eq(3)').remove(); };

function resourceCol() { $('table tr').find('td:eq(4),th:eq(4)').remove(); };

function typeCol() { $('table tr').find('td:eq(5),th:eq(5)').remove(); };

function removeColumns() {
    statusCol();
    statsCol();
    thumbCol();
    roleCol();
    resourceCol();
    typeCol();
}
