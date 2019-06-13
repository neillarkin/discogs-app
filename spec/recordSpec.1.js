const testURL = "https://api.discogs.com/artists/125246/releases"
var myArray = []

function fetchData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Fetch JSON data")
            callback(JSON.parse(this.responseText));
            console.log("Callback complete");
            runTests();
            console.log(myArray);
        }
    };

    xhr.open("GET", url);
    xhr.send();
}

function createArray(url) {

    fetchData(url, function(data) {

        myArray = data.releases;
        console.log("Start loop");
        myArray.forEach(function(record) {
            myArray.push(record);

            console.log("Push to MyArray " + myArray[0].artist)
        })
    })


}

createArray(testURL);


// runTests();


function runTests() {
    console.log("Begin tests")
    // console.log("Begin tests ????"  + myArray[0].artist)

    describe("Test Releases Object", function() {
        console.log("Descibe 1")
        // beforeEach(function() {
        //     console.log("BeforeEach")
        //     // getData(createArray);
        //     // createArray(testURL)


        // });

        describe("Check if Response is an object", function() {
            it("Should return object", function() {
                console.log("Descibe 2")
                expect(typeof myArray).toBe("object");

            });
        })

        describe("Check if arrays 'artist' value is a string", function() {
            it("Should return true", function() {
                // var name = myArray[0].artist
                console.log("First log Array: " + myArray)
                console.log("Second log artist:" + myArray[0])
                expect(typeof name).toBe("string");
            });
        })
    });

}
