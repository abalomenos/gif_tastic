
// To be able to easily modify root directory
var path = "./assets/";

var topics = [
    "cat",
    "dog",
    "hamster",
    "bird",
    "turtle",
    "dolphin"
];

var api = "https://api.giphy.com/v1/gifs/search?";

var apiKey = "api_key=rfocwg4M5WmFJjT4DndZP00ig3KmLTVw";

var topic = "cat";

var search = "&q=" + topic;

var limit = "&limit=10";

var queryURL = api + apiKey + search + limit;

var resultArray = [];

var imagePath = "https://media0.giphy.com/media/";
var imageStaticPath = "/giphy-downsized_s.gif"
var imageGifPath = "/giphy-downsized.gif";

for (var i= 0; i < topics.length; i++) {
    var button = $("<button>");
    button.addClass("topicButton");
    button.text(topics[i].toUpperCase());
    $("#topicButtons").append(button);
}

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    console.log(response);

    for (var i = 0; i < response.data.length; i++) {
        
        var rating = response.data[i].rating;
        var imageID = response.data[i].id;
        
        var renderImage = imagePath + imageID + imageStaticPath;
        resultArray.push(imageID);
        
        
        var searchResultsDiv = $("<div class='searchResults'>");

        var ratingP = $("<p>").text("Rating: " + rating);
        searchResultsDiv.append(ratingP);
        
        var image = $("<img>");
        image.attr("src", renderImage);
        image.attr("id", i);
        image.addClass("imageStatic");
        
        searchResultsDiv.append(image);
        // imageDiv.append(gif);
        
        $(".results").prepend(searchResultsDiv);
        console.log(resultArray);
    }
  });

  // On click - Static to Gif
$(document).on('click','.imageStatic', function() {
    $(this).attr("src", imagePath + resultArray[this.id] + imageGifPath);
    $(this).addClass("imageGif").removeClass("imageStatic")
});
$(document).on('click','.imageGif', function() {
    $(this).attr("src", imagePath + resultArray[this.id] + imageStaticPath);
    $(this).addClass("imageStatic").removeClass("imageGif")
});