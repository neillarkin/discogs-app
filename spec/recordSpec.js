const testURL = "https://api.discogs.com/artists/125246/releases"
const artist_Test_Name = "Nirvana";
var myArray = []


//get the JSOn data from the releases.js getData() function
function createArray(url) {
    getData(url, function(data) {
        myArray = data.releases;
        console.log(url);
        myArray.forEach(function(record) {
            myArray.push(record);
         })
    })
}


describe("Test Releases Object", function() {

    beforeEach(function() {
        createArray(testURL)
        var name;
    });

    describe("Check if Response is an object", function() {
        it("Should return object", function() {
            //checks if value type is an object
            expect(typeof myArray).toBe("object");

        });
    })

    describe("Check if arrays 'artist' value is: " + artist_Test_Name, function() {
        it("Should return " + artist_Test_Name, function() {

            //used a Timeout here becuase array had not been generated before this Describe() function was called.
            //the test simply checks if the first array object artist property is equal to Nirvana 
            setTimeout(function() {
                name = myArray[0].artist;
            }, 2000)

            expect(name).toBe(artist_Test_Name);
        });
    })
});
