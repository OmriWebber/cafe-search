$.ajax({
  url: "url",
  dataType: "json",
  success: function(data){
    console.log(data);
  },
  error: function(){
    console.log("something went wrong.");
  }
});
