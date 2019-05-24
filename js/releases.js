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
        tableHeaders.push(`<th>${key}</th>`);
    });


    if (tableHeaders[0] === "<th>stats</th>") {
        tableHeaders.unshift("<th>Status</th>");

    }


    // let myHeader = tableHeaders.shift(tableHeaders.shift());
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

function writeToDocument(url) {

    var tableRows = [];
    var el = document.getElementById("data");
    $("#data").html(`<div id="loader"><img src="imgs/loader.gif" alt="loading..." /></div>`);

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
                var truncatedData = rowData.substring(0, 40);

                dataRow.push(`<td>${truncatedData}</td>`);
            });
            // var myRow = dataRow.shift(dataRow.shift());

            tableRows.push(`<tr>${dataRow}</tr>`);

        });

        el.innerHTML = `<table class="table-light table-striped" id="table-releases">${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");;
        // removeColumns();
        cleanColumns();

    });


}

// 0 1 2 6 8 10


function cleanColumns() {

    $.moveColumn = function(table, from, to) {
        var rows = $('tr', table);
        var cols;
        rows.each(function() {
            cols = $(this).children('th, td');
            cols.eq(from).detach().insertBefore(cols.eq(to));
        });
    }

    var tbl = $('table');
    $.moveColumn(tbl, 9, 0);
    $.moveColumn(tbl, 5, 1);
    $.moveColumn(tbl, 8, 2);
    $.moveColumn(tbl, 6, 3);
    $.moveColumn(tbl, 7, 4);

    // tbl = $('table tr');
    var tbl2 = $('table tr');

    tbl2.find('td:eq(11),th:eq(11)').remove();
    tbl2.find('td:eq(10),th:eq(10)').remove();
    tbl2.find('td:eq(9),th:eq(9)').remove();
    tbl2.find('td:eq(8),th:eq(8)').remove();
    tbl2.find('td:eq(7),th:eq(7)').remove();
    tbl2.find('td:eq(6),th:eq(6)').remove();
    tbl2.find('td:eq(5),th:eq(5)').remove();

}
