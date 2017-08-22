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
    url: "https://graph.facebook.com/v2.10/" + data.name + "?fields=about%2Clocation&access_token=EAABy0zkU5Y0BAK7S9BVN4Suj95GMJWgrK8lZA9yBpkrGfVPE7fAgKB9uBYS3NH52ekJVEGgHkAgj4uRQ0rn5Wwh7RuiuCigc7KQojn2JSiofxZCN9aJikK16L5B91P3MU9BxbdzDZCDZA1JhUEIdAhlZAdhDdAxulxRvbOiS3ymAMy2ZBvHIpa3ExU2F1oOkWJIFf7koADtwZDZD",
    dataType: "jsonp",
    success: function(dataFromFacebook){
      console.log(dataFromFacebook);
    },
    error: function(){
      console.log("Couldn't get Facebook data");
    }
  });
}
