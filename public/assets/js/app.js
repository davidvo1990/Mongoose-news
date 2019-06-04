// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the information on the page
    $("#articles").append("<div class='art jumbotron ' data-id='" + data[i]._id + "'>"
      + "<p data-id='" + data[i]._id + "'>"
      + "<h2>" + data[i].title + "</h2>"
      + "<img src=" + data[i].photos + " alt=" + data[i].title + " /><br />"
      + "<strong>Link: </strong><a href='https://www.nytimes.com" + data[i].link + "'>https://www.nytimes.com" + data[i].link + "</a><br />"
      + "<strong>Summary: </strong>" + data[i].summary + "<br />"
      + "</p>"
      // + "<button class='btn' data-id='" + data[i]._id + "'>Note</button>"
      + "</div>");

    // if (data[i].note){
    //   $("#articles").append("<p>"+data[i].note.title+"</p>")
    // }

    // $("#articles").append("<p data-id='" + data[i]._id + "'>" 
    // + data[i].title + "<br />" 
    // + data[i].link + "</p>");

  }
  if (data.length < 20) {
    $(document).on("click", ".scrape", function () {
      // Now make an ajax call for the Article
      $.ajax({
        method: "GET",
        url: "/scrape/"
      })
        // With that done, add the note information to the page
        .then(function (data) {
          location.reload();
        })
    })
  }
});


// When you click the savenote button
$(document).on("click", "#savenote", function () {
  $("#results-modal").modal("toggle");

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  var title = $("#titleinput").val()
  var body = $("#bodyinput").val()
  var arttitle = $("#arttitle").text()
  console.log(title)
  console.log(body)

  $("#message").append("<div><h3>" + arttitle + "</h3>"
    + "<p><strong>Title: </strong>" + title + "</p>"
    + "<p><strong>Comments: </strong>" + body + "</p></div>")

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      if (data.note) {
     
        // $("#message").append("<div><h3>" + data.title + "</h3>"
        //   + "<p>" + data.note.title + "</p>"
        //   + "<p>" + data.note.body + "</p></div>")
        $(".modal-title").html("<h3>" + data.title + "</h3>")
        $(".modal-body").html("<p><strong>Title: </strong>" + data.note.title + "</p>")
        $(".modal-body").append("<p><strong>Comments: </strong>" + data.note.body + "</p>")
      
      }
    })

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: title,
      // Value taken from note textarea
      body: body
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      // console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });


  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// Whenever someone clicks a p tag
$(document).on("click", ".art", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // console.log($(this))
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      // console.log(data);
      // The title of the article

      $("#notes").append("<div class='jumbotron messa'></div>")
      $(".messa").append("<h4 id='arttitle'>" + data.title + "</h4>");
      // An input to enter a new title
      $(".messa").append("<input id='titleinput' name='title' />");
      // A textarea to add a new note body
      $(".messa").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(".messa").append("<button type='button' class='btn btn-primary mt-5' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
        // console.log($(this))
        // $(document).on("click", "#savenote", function () {

        //   $(".modal-title").html("<h3>" + data.title + "</h3>")
        //   $(".modal-body").html("<p><strong>Title: </strong>" + data.note.title + "</p>")
        //   $(".modal-body").append("<p><strong>Comments: </strong>" + data.note.body + "</p>")
        // })
      }
    });
});