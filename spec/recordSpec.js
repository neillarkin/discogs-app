const testURL = "https://api.discogs.com/artists/125246/releases"
const artist_Test_Name = "Nirvana";
var myArray = []

function fetchData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Fetch JSON data")
            callback(JSON.parse(this.responseText));
            console.log("Callback complete");
            // runTests();
            console.log(myArray);

        }
    };

    xhr.open("GET", url);
    xhr.send();
}

function createArray(url) {
    getData(url, function(data) {
        myArray = data.releases;
        console.log(url);
        myArray.forEach(function(record) {
            myArray.push(record);
            console.log("Push to MyArray " + myArray[0].artist)
        })
    })


}

// createArray(testURL);
// runTests();


// function runTests() {
// console.log("Begin tests")
// console.log("Begin tests ????"  + myArray[0].artist)

describe("Test Releases Object", function() {

    beforeEach(function() {
        // getData(createArray);
        createArray(testURL)
        var name;
    });

    describe("Check if Response is an object", function() {
        it("Should return object", function() {
            console.log("Descibe 2")

            expect(typeof myArray).toBe("object");

        });
    })

    describe("Check if arrays 'artist' value is: " +artist_Test_Name, function() {
        
        it("Should return " + artist_Test_Name, function() {
            console.log("Descibe 3")
            
            setTimeout(function(){
                name = myArray[0].artist;
                console.log("THIS is artist:" +name)
            },2000)
            // console.log("First log Array: " + myArray)
            
            expect(name).toBe(artist_Test_Name);
        });
    })
});

// }
