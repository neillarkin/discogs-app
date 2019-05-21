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
                if (item.status === undefined ) {
                    return this;
                   }
       
                var rowData = item[key].toString();
                var truncatedData = rowData.substring(0, 30);
                
                dataRow.push(`<td>${truncatedData}</td>`);
            });
            // var myRow = dataRow.shift(dataRow.shift());

            tableRows.push(`<tr>${dataRow}</tr>`);

        });
        el.innerHTML = `<table class="table-light table-striped">${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");;
        // deleteEmptyRow(tableRows);

    });


}

function deleteEmptyRow(row) {
    // (!cell || 0 === cell.length)
    var counter;
    
    row.forEach(function(cell){
        counter =counter++;
    if (cell === "#"){
           row.deleteCell();
        }
    })
}
