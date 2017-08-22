var accessToken;



function getAccessToken(data){
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
    url: "https://graph.facebook.com/v2.10/" + data.name + "?fields=about%2Clocation&access_token="+accessToken,
    dataType: "jsonp",
    success: function(dataFromFacebook){
      console.log(dataFromFacebook);
    },
    error: function(){
      console.log("Couldn't get Facebook data");
    }
  });
}
