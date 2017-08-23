// var accessToken;

$.ajax({
  url: "/data/data.json",
  dataType: "json",
  success: function(data){
    console.log(data.places);
    for (var i = 0; i < data.places.length; i++) {
      $("#placesList").append("<li class='place' onclick='showInfo();'>" + data.places[i].name + "</li>");
    }
  },
  error: function(){
    console.log("something went wrong.");
  }
});

function showInfo(){
  console.log($(this));
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
    url: "https://graph.facebook.com/v2.10/OliveCafe?fields=about%2Clocation&access_token="+accessToken,
    dataType: "jsonp",
    success: function(dataFromFacebook){
      console.log(dataFromFacebook);
    },
    error: function(){
      console.log("Couldn't get Facebook data");
    }
  });

  $('#placesList').addClass('slideOutLeft');
  $('#placeInfo').show().addClass('slideInRight');
}
