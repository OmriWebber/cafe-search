var accessToken, fbPageID;

$(document).ready(function(){

  $("#backToList").click(function(){
    $('#sidebar').removeClass('slideOutLeft').addClass('slideInLeft');
    $('#placeInfo').removeClass('slideInRight').addClass('slideOutRight');
  });

  $.ajax({
    url: "/data/data.json",
    dataType: "json",
    success: function(data){
      console.log(data.places);
      for (var i = 0; i < data.places.length; i++) {
        $("#placesList").append("<li class='place'>" + data.places[i].name + "</li>");
      }
      $('.place').click(function() {
          var places = this.innerText;
          for (var i = 0; i < data.places.length; i++) {
            if(places == data.places[i].name) {
              fbPageID = data.places[i].fbID;
              $('#sidebar').removeClass('slideInLeft').addClass('slideOutLeft');
              $('#placeInfo').removeClass('slideOutRight').addClass('slideInRight');
              if(fbPageID == "null") {
                $("#error").text("Sorry, " + data.places[i].name + " does not have a facebook page");
                return;
              }
              $("#error").empty();
              showInfo();
              return;
            }
          }
      });
    },
    error: function(){
      console.log("something went wrong.");
    }
  });


  function showInfo(){
    $.ajax({
      url: "./config.json",
      dataType: "json",
      success: function(configData){
        accessToken = configData.fAccessToken;
        getData(accessToken);
      },
      error: function(){
        console.log("Couldn't get Access Token");
      }
    });
  }

  function getData(accessToken){
    $.ajax({
      url: "https://graph.facebook.com/v2.10/" + fbPageID + "?fields=about%2Clocation&access_token="+accessToken,
      dataType: "jsonp",
      success: function(dataFromFacebook){
        console.log(dataFromFacebook);
      },
      error: function(){
        console.log("Couldn't get Facebook data");
      }
    });
  }

});
