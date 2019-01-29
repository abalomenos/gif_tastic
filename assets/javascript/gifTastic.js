
// To be able to easily modify root directory
var path = "./assets/";

// Array of objects with hard-coded topics
var topics = [
    {
        id : "0",
        name : "CAT"
    },
    {
        id : "1",
        name : "DOG"
    },
    {
        id : "2",
        name : "BIRD"
    },
    {
        id : "3",
        name : "TURTLE"
    }
];

// Offset counter for results
var counter = 0;

// Giphy API
var api = "https://api.giphy.com/v1/gifs/search?";

// API Key
var apiKey = "api_key=rfocwg4M5WmFJjT4DndZP00ig3KmLTVw";

// Initilalize result array
var resultArray = [];

// Initialize Topic for search
var topicName = "";

var flag1 = 0;
var flag2 = 0;

// Initial default Rating
var rating = "g";



//********** Download **********
function forceDownload(blob, filename) {
    var a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    a.click();
}

function downloadResource(url, filename) {
    if (!filename) filename = url.split('\\').pop().split('/').pop();
    fetch(url, {
        headers: new Headers({
            'Origin': location.origin
        }),
        mode: 'cors'
        })
        .then(response => response.blob())
        .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
        })
        .catch(e => console.error(e));
}
//******** Download End ********

// Initialize and Retrieve Local Storage
function initializeLocalStorage() {
    try {
        // Topics
        localStorage.removeItem('topicsLS');
        localStorage.setItem('topicsLS', JSON.stringify(topics));
        var topicsLS = JSON.parse(localStorage.getItem('topicsLS')); // Topics from Local Storage will always be initiallized with original Topics

        // Favorites
        var favoritesLS = JSON.parse(localStorage.getItem('favoritesLS'));
        favoritesLS = favoritesLS ? favoritesLS : [];
        if (favoritesLS.length == 0){
            localStorage.setItem('favoritesLS', JSON.stringify(favoritesLS));
        }

        // Current ID
        var currentID = localStorage.getItem('currentID');
        currentID = currentID ? currentID : "";

        if (currentID == "") {
            localStorage.setItem('currentID', topics.length);
        }
        return topicsLS, favoritesLS, currentID;
    } catch(err) { // in the event Local Storage is cleared and browser is not refreshed, catch possible error
        console.log("Error ILS: " + err);
        localStorage.clear();
        InitializeWindow();
    }
}

// Error handler - if Local Storage is cleared and browser is not refreshed
function errorCatch() {
    topicsLS = localStorage.getItem('topicsLS');
    favoritesLS = localStorage.getItem('favoritesLS');
    currentID = localStorage.getItem('currentID');
    if (topicsLS == null || favoritesLS == null || currentID == null) {
        console.log("ErrorCatch");
        return true;
    } else {       
        return false;
    }
}

// Reset current Search
function clear() {
    counter = 0;
    resultArray = [];
    $(".results").empty();
}

// Initialize everything
function InitializeWindow() {
    $(".moreResults").hide();
    $(".resultsMessage").hide();
    $("#favoriteTopicMessage").hide();
    $("#topicMessage").hide();
    clear();
    initializeLocalStorage();
    renderFavorites();
    updateTopics(null, null, 3);
    
}

// Render Favorites
function renderFavorites() {
    try {
        favoritesLS = JSON.parse(localStorage.getItem('favoritesLS'));
        $("#favoriteButtons").empty(); // in order not to repeat old buttons
        for (var i = 0; i < favoritesLS.length; i++){    
            var favoriteTable = $("<tr id='favoriteTR" + favoritesLS[i].id + "'>");
            var leftTable = $("<td>");
            var rightTable = $("<td>");
            var favoriteTopic = $("<button>");
            var imageRemoveFavorite = $("<img>");

            favoriteTopic.addClass("topicButton");
            favoriteTopic.attr("id", "favoriteTopicButton" + favoritesLS[i].id);
            favoriteTopic.text(favoritesLS[i].name);
            leftTable.append(favoriteTopic);
            imageRemoveFavorite.addClass("imageRemoveFavorite");
            imageRemoveFavorite.attr("id", "imageRemoveFavorite" + favoritesLS[i].id);
            imageRemoveFavorite.attr("src", path + "images/checkmark_remove.png");
            imageRemoveFavorite.attr("width", "30px");
            imageRemoveFavorite.attr("hight", "30px");
            rightTable.append(imageRemoveFavorite);
            favoriteTable.append(leftTable);
            favoriteTable.append(rightTable);
            $("#favoriteButtons").append(favoriteTable);
        }
        if (favoritesLS.length == 0) {
            $("#favoriteTopicMessage").show();
        } else {
            $("#favoriteTopicMessage").hide();
        }
    } catch(err) { // in the event Local Storage is cleared and browser is not refreshed, catch possible error
        console.log("Error RF: " + err);
        localStorage.clear();
        InitializeWindow();
    }
}

// Update changes to Favorites
function updateFavorites(favoriteID, favoriteName, flag1){
    try {
        
        favoritesLS = JSON.parse(localStorage.getItem('favoritesLS'));
        
        if (flag1 == 1) { // add a favorite
            if (favoritesLS.length == 0 || favoritesLS.findIndex(item => item.id == favoriteID) == -1) {
                favoritesLS.push({"id" : favoriteID, "name" : favoriteName});
                localStorage.setItem('favoritesLS', JSON.stringify(favoritesLS));
            }
        } else if (flag1 == 2) { // remove a favorite
            favoritesLS.splice(favoritesLS.findIndex(item => item.id == favoriteID),1);
            localStorage.setItem('favoritesLS', JSON.stringify(favoritesLS));
        }
        renderFavorites();
    } catch(err) { // in the event Local Storage is cleared and browser is not refreshed, catch possible error
        console.log("Error UF: " + err);
        localStorage.clear();
        InitializeWindow();
    }
}

// Render Topics
function renderTopics() {
    try {
        topicsLS = JSON.parse(localStorage.getItem('topicsLS'));
        for (var i=0; i < topicsLS.length; i++) {
            var topicTable = $("<tr>");
            var leftTable = $("<td>");
            var rightTable = $("<td>");
            var buttonTopic = $("<button>");
            var imageAddFavorite = $("<img>");

            buttonTopic.addClass("topicButton");
            buttonTopic.attr("id", "topicButton" + topicsLS[i].id);
            buttonTopic.text(topicsLS[i].name);
            leftTable.append(buttonTopic);
            imageAddFavorite.addClass("imageAddFavorite");
            imageAddFavorite.attr("id", "imageAddFavorite" + topicsLS[i].id);
            imageAddFavorite.attr("src", path + "images/favorite_add.png");
            imageAddFavorite.attr("width", "30px");
            imageAddFavorite.attr("hight", "30px");
            rightTable.append(imageAddFavorite);
            topicTable.append(leftTable);
            topicTable.append(rightTable);   
            $("#topicButtons").append(topicTable);
        }
        if (topicsLS.length == 0) {
            $("#topicMessage").show();
        } else {
            $("#topicMessage").hide();
        }
    } catch(err) { // in the event Local Storage is cleared and browser is not refreshed, catch possible error
        console.log("Error RT: " + err);
        localStorage.clear();
        InitializeWindow();
    }
}

// Update changes to Topics
function updateTopics(favoriteID, favoriteName, flag2) {
    try {    
        topicsLS = JSON.parse(localStorage.getItem('topicsLS'));
        favoritesLS = JSON.parse(localStorage.getItem('favoritesLS'));
        
        if (flag2 == 1 ){ // remove item from Topics after adding to Favorites
            topicsLS.splice(topicsLS.findIndex(item => item.id == favoriteID),1);
            localStorage.setItem('topicsLS', JSON.stringify(topicsLS));
        } else if (flag2 == 2) { // add item back to Topics after removeing from Favorites
            topicsLS.push({"id" : favoriteID, "name" : favoriteName});
            localStorage.setItem('topicsLS', JSON.stringify(topicsLS));
        } else if (flag2 == 3) { // remove items from Topics that are in Favorites
            for (var k=0; k < favoritesLS.length; k++) {
                for (var i = 0; i < topicsLS.length; i++) {
                    if (topicsLS[i].id == favoritesLS[k].id) {
                        topicsLS.splice(i,1);
                        localStorage.setItem('topicsLS', JSON.stringify(topicsLS));
                        topicsLS = JSON.parse(localStorage.getItem('topicsLS'));
                    }
                }
            }
        }
        $("#topicButtons").empty(); // in order not to repeat old buttons
        renderTopics();
    } catch(err) { // in the event Local Storage is cleared and browser is not refreshed, catch possible error
        console.log("Error UT: " + err);
        localStorage.clear();
        InitializeWindow();
    }
}

// Perform the actual Search using the Giphy API
function topicSearch(topicName) {

    $(".resultsMessage").removeClass('animated zoomInDown');
    var search = "&q=" + topicName;
    var limit = "&limit=10";
    var offset = "&offset=" + counter;
    var ratingString = "&rating=" + rating;
    var queryURL = api + apiKey + search + limit + offset + ratingString;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        for (var i = 0; i < response.data.length; i++) {
            
            // Get necessary values from response
            var imageID = response.data[i].id;
            var imageTitle = response.data[i].title;
            var imageRating = response.data[i].rating;
            var imageStaticPath = response.data[i].images.downsized_still.url;
            var imageGifPath = response.data[i].images.downsized.url;
            
            // Create an Array of Objects and store the values for each item
            resultArray.push({
                ID : imageID,
                StaticPath : imageStaticPath,
                GifPath : imageGifPath,
                Rating : imageRating,
                Title : imageTitle
            });
            
            var searchResultsDiv = $("<div class='searchResults animated bounceInUp'>");

            //Get Title
            var title = $("<h3>").text(imageTitle.toUpperCase());
            searchResultsDiv.append(title);

            // Get Image            
            var image = $("<img>");
            image.attr("src", imageStaticPath);
            image.attr("id", counter + i);
            image.addClass("imageStatic imageResults");
            searchResultsDiv.append(image);
            
            searchResultsDiv.append($("<hr>"));

            //Get Rating
            var ratingP = $("<p>").text("Rating: " + imageRating.toUpperCase());
            searchResultsDiv.append(ratingP);
            
            searchResultsDiv.append($("<hr>"));

            //Static Download Link
            var downloadStatic = $("<button>");
            downloadStatic.attr("id", counter + i);
            downloadStatic.addClass("downloadStatic downloadButton");
            downloadStatic.text("Download image");
            searchResultsDiv.append(downloadStatic);

            //Gif Download Link
            var doanloadGif = $("<button>");
            doanloadGif.attr("id", counter + i);
            doanloadGif.addClass("downloadGif downloadButton");
            doanloadGif.text("Download Gif");
            searchResultsDiv.append(doanloadGif);

            $(".results").append(searchResultsDiv);
        }

        if (resultArray === undefined || resultArray.length == 0) {
            $(".moreResults").hide();
            $(".results").append($("<h3>").text("No results. Search something else..."));
        } else {
            $(".moreResults").show();
            $(".resultsMessage").addClass('animated zoomInDown');
            $(".resultsMessage").show();
        }
    });
}


// Get Rating
$("input[name=rating]").change(function(){ 
    rating = this.id.toLowerCase();
});

// On Submit - Search for Topic from text area and create Button
$("#search").submit(function(event) {
    if (errorCatch()) { // will be true if Local Storage is cleared and browser is not refreshed
        localStorage.clear();
        InitializeWindow();
    } else {
        topicName = $("#searchTopic").val().trim().toUpperCase();
        if (topicName.length != 0) { // make sure at least one character is pressed to search
            topicsLS = JSON.parse(localStorage.getItem('topicsLS'));
            favoritesLS = JSON.parse(localStorage.getItem('favoritesLS'));
            currentID = JSON.parse(localStorage.getItem('currentID'));
            if (topicsLS.findIndex(item => item.name == topicName) == -1 && favoritesLS.findIndex(item => item.name == topicName) == -1) { // if it doesnt exits
                topicsLS.push(({"id" : currentID, "name" : topicName}));
                currentID++;
                localStorage.setItem('topicsLS', JSON.stringify(topicsLS));
                localStorage.setItem('currentID', currentID);
                updateTopics(null, null, 3);
                clear()
                topicSearch(topicName);
            } else {
                clear()
                topicSearch(topicName);
            }
        }
    }
    event.preventDefault();
});

// On Click - Search for Topic from Button
$(document).on('click','.topicButton', function() {
    topicName = $(this).text();
    clear();
    topicSearch(topicName);
});

// Display more results
$(document).on('click','.moreResultsButton', function() {
    counter += 10;
    topicSearch(topicName);
});

// On Click - Add to Favorites
$(document).on('click','.imageAddFavorite', function() {
    if (errorCatch()) { // will be true if Local Storage is cleared and browser is not refreshed
        localStorage.clear();
        InitializeWindow();
    } else {
        var selectedItemID = this.id.split("imageAddFavorite")[1];
        var selectedItemName = $("#topicButton" + selectedItemID).text();
        updateTopics(selectedItemID, selectedItemName, 1);
        updateFavorites(selectedItemID, selectedItemName, 1);
    }
});

// On Click - Remove from Favorites
$(document).on('click','.imageRemoveFavorite', function() {
    if (errorCatch()) { // will be true if Local Storage is cleared and browser is not refreshed
        localStorage.clear();
        InitializeWindow();
    } else {
        var selectedItemID = this.id.split("imageRemoveFavorite")[1];
        var selectedItemName = $("#favoriteTopicButton" + selectedItemID).text();
        updateFavorites(selectedItemID, selectedItemName, 2);
        updateTopics(selectedItemID, selectedItemName, 2);
    }
});

// On click - Static to Gif
$(document).on('click','.imageStatic', function() {
    $(this).attr("src", resultArray[this.id].GifPath);
    $(this).addClass("imageGif").removeClass("imageStatic")
});

// On click - Gif to Static
$(document).on('click','.imageGif', function() {
    $(this).attr("src", resultArray[this.id].StaticPath);
    $(this).addClass("imageStatic").removeClass("imageGif")
});

// On click - Download Static Image
$(document).on('click','.downloadStatic', function() {
    downloadResource(resultArray[this.id].StaticPath, resultArray[this.id].Title + "_image");
    return false;
});

// On click - Download Animated GIF
$(document).on('click','.downloadGif', function() {
    downloadResource(resultArray[this.id].GifPath, resultArray[this.id].Title + "_gif");
    return false;
});

// Everything starts here
window.onload = function() {
    InitializeWindow();
}


