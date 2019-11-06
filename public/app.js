var thisId;

//Handle Save Article button
$(".saveBtn").on("click", function () {
  thisId = $(this).attr("data-id");
  console.log(thisId)
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId

  }).then(data => console.log("Saved: ", data));
  // location.reload(); 
});



// When you click the savenote button-- POST note 
$(".saveNote").on("click", function () {
  // Grab the id associated with the article from the submit button
  // if ($("#inputNote").val().trim() === "" ){
  //   alert("Enter text!"); 
  // }

  thisId = $(this).attr("data-id");
  console.log(thisId)

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/save/" + thisId,
    data: {
      // Value taken from title input
      // Value taken from note textarea
      body: $("#inputNote").val().trim()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log("data ", data);
      // Empty the notes section
      // $("#inputNote").empty();
      // location.reload(); 
    });

  // Also, remove the values entered in the input and textarea for note entry
  // $("#inputNote").val("");
  location.reload()
});


//GET your note function
$(".viewNote").on("click", function () {
  thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

  .then(function(data) {
    var noteDiv = $(".notes[data-id='" + thisId + "' ]");
    noteDiv.append(data.note.body); 

    console.log("Got note: ", data);
  

  })
});


