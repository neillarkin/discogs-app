const testURL = "https://api.discogs.com/artists/125246/releases"
var releases = new Array();

function getData(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", testURL);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };
}

function createArray(data) {
    data = data.releases;
    data.forEach(function(record) {
        releases.push(record);
    })
}

describe("Test Releases Object", function() {

    beforeEach(function() {
        getData(createArray);
    });

    describe("Check if Response is an object", function() {
        it("Should return object", function() {
            expect(typeof releases).toBe("object");

        });
    })

    describe("Check if arrays 'artist' value is a string", function() {
        it("Should return true", function() {
            var name = releases[0].artist;
            expect(typeof name).toBe("string");
        });
    })
});