# gif_tastic
6: GifTastic

**Overview**

Use of GIPHY API that allows the user to search for GIFS.

* User can search for GIFS from pre-defined Topics
  * These are hard-coded in an array of objects
* User can search for any GIFS from the search box
  * New Topics are automatically added to the “Topics” section
* User can bookmark any Topic, which is saved in the “Favorite Topics” session
  * This utilizes Local Storage
* Results are presented as still images
  * When user clicks on the image the animated GIF is shown
* User can download either the still image or the animated GIF
* Each search retrieves 10 results
  * After searching, by clicking "More Results" an additional 10 results are retrieved
