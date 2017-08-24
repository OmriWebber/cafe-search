var accessToken, fbPageID, position, map, marker, userLocation, routeExist = false;

function initMap() {
  var center = {
    lat: -41.2932875,
    lng: 174.7837708
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    minZoom: 5,
    center: center
  });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    userLocation = {
      "lat": position.coords.latitude,
      "lng": position.coords.longitude
    };
    console.log(userLocation);
  })
} else {
  console.log("Browser does not support geolocation");
}

$(document).ready(function() {

  // Back Button Functionality
  $("#backToList").click(function() {
    $('#sidebar').removeClass('slideOutLeft').delay(100).show().addClass('slideInLeft');
    $('#placeInfo').removeClass('slideInRight').delay(100).addClass('slideOutRight').delay(500).hide();
  });

  // Gets data from data.json and displays in list
  $.ajax({
    url: "/data/data.json",
    dataType: "json",
    success: function(data) {
      console.log(data.places);
      for (var i = 0; i < data.places.length; i++) {
        $("#placesList").append("<li class='place'>" + data.places[i].name + "</li>");
      }
      $('.place').click(function() {
        var places = this.innerText;
        for (var i = 0; i < data.places.length; i++) {
          if (places == data.places[i].name) {
            fbPageID = data.places[i].fbID;
            console.log(fbPageID);
            if (fbPageID == "null") {
              $("#placeDescription").empty();
              $("#placeTitle").text(data.places[i].name);
              $("#error").text("Sorry, " + data.places[i].name + " does not have a facebook page");
              $("#correctFB").hide();
              $('#sidebar').removeClass('slideInLeft').delay(100).addClass('slideOutLeft').delay(500).hide();
              $('#placeInfo').removeClass('slideOutRight').delay(100).show().addClass('slideInRight');
              position = {
                "lat": Number(data.places[i].coords.lat),
                "lng": Number(data.places[i].coords.lng)
              };
              showMarker(position);
              return;
            } else {
              showInfo(fbPageID);
            }
            $("#error").empty();
            return;
          }
        }
      });
    },
    error: function() {
      console.log("something went wrong.");
    }
  });


  function showInfo() {
    $.ajax({
      url: "./config.json",
      dataType: "json",
      success: function(configData) {
        accessToken = configData.fAccessToken;
        getData(accessToken);
      },
      error: function() {
        console.log("Couldn't get Access Token");
      }
    });
  }

  function getData(accessToken) {
    $.ajax({
      url: "https://graph.facebook.com/v2.10/" + fbPageID + "?fields=name%2Clocation%2Cabout%2Coverall_star_rating%2Crating_count%2Cprice_range%2Cfood_styles&access_token=" + accessToken,
      dataType: "jsonp",
      success: function(dataFromFacebook) {
        console.log(dataFromFacebook);
        if (dataFromFacebook.error) {
          console.log(dataFromFacebook.error);
        } else {
          position = {
            "lat": dataFromFacebook.location.latitude,
            "lng": dataFromFacebook.location.longitude
          };
          $("#correctFB").show();
          $("#placeTitle").text(dataFromFacebook.name);
          if (!dataFromFacebook.about) {
            $("#placeDescription").text(dataFromFacebook.name + " does not have a description.");
          } else {
            $("#placeDescription").text(dataFromFacebook.about);
          }
          if (dataFromFacebook.food_styles) {
            $("#foodTypes").show();
            $("#foodTypes").empty();
            for (var i = 0; i < dataFromFacebook.food_styles.length; i++) {
              $("#foodTypes").append("<li>" + dataFromFacebook.food_styles[i] + "</li>");
            }
          } else {
            $("#foodTypes").hide();
          }
          $("#rating").text(dataFromFacebook.overall_star_rating);
          $("#totalRatings").text(dataFromFacebook.rating_count);
          $("#price").text(dataFromFacebook.price_range);
          $('#sidebar').removeClass('slideInLeft').delay(100).addClass('slideOutLeft').delay(500).hide();
          $('#placeInfo').removeClass('slideOutRight').delay(100).show().addClass('slideInRight');
          showMarker(position, dataFromFacebook);
        }
      },
      error: function() {
        console.log("Couldn't get Facebook data");
      }
    });
  }

  function showMarker(position, dataFromFacebook) {
    console.log(position);
    var directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    });

    // Set destination, origin and travel mode.
    var request = {
      destination: position,
      origin: userLocation,
      travelMode: 'WALKING'
    };

    console.log(request.origin);

    // Pass the directions request to the directions service.
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        // Display the route on the map.
        if(routeExist = true) {
          directionsDisplay.setMap(null);
        } else {
          directionsDisplay.setMap(map);
          directionsDisplay.setDirections(response);
          routeExist = true;
        }

        directionsDisplay.setMap(map);
        directionsDisplay.setDirections(response);



      }
    });

    if (marker) {
      marker.setPosition(position);
      map.panTo(position);
      map.setZoom(15);
    } else {
      marker = new google.maps.Marker({
        position: position,
        map: map
      });
      map.panTo(position);
      map.setZoom(15);
    }
  }

});
