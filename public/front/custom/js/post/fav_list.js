var marker;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
 
    center: {lat:latitude , lng:lngitude }
  });

  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: {lat: latitude, lng:lngitude}
  });
  marker.addListener('click', toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

$(function(){
  $(".socialShare").jsSocials({
      shares: ["facebook", "twitter", "linkedin"],
      showCount: true,
      shareIn: "popup",
  });


  $('body').on('click', '.favBtn', function(e){
    e.preventDefault();
    var post_id = $(this).attr('id'); 

    $.ajax({
      url: HTTP_PATH + "post/addFavlist",
      type: 'post',
      data: 'post_id='+post_id,
      dataType: 'json',
      success: function (data, status) {
        errors_remove();
        if (data.success) {
			$(".favBtn").html("<b>added</b>");
        // window.location = HTTP_PATH+"account";
         } 
      }
    });
  });
  $('body').on('click', '.printPage', function(e){
    e.preventDefault();
    window.print();
  })
});