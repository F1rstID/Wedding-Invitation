window.addEventListener("load", () => {
  getAllData();
});

function getAllData() {
  $.ajax({
    type: "GET",
    url: "/api/load",
    data: {},
    success: function (response) {
      $(".main-wedding-img").css({
        backgroundImage: `url(${response["image_url"]})`,
      });

      $("#main-title").text(response["main_title"]);
      $(".groom-name").text(response["groom_name"]);
      $(".bride-name").text(response["bride_name"]);
      $("#groom-name").val(response["groom_name"]);
      $("#bride-name").val(response["bride_name"]);

      $("#floating-input-detail-date").text(response["wedding_date"]);
      $("#floating-input-detail-location").text(
        response["wedding_detail_location"]
      );
      $("#invite-phrases-textarea").text(response["invitation_parases"]);
      $("#groom-father-name").text(response["groom_father_name"]);
      $("#groom-mother-name").text(response["groom_mother_name"]);
      $("#bride-father-name").text(response["bride_father_name"]);
      $("#bride-mother-name").text(response["bride_mother_name"]);

      $("#wedding-hall-name").val(response["wedding_hall_name"]);
      $("#wedding-hall-address").val(response["wedding_hall_address"]);

      $("#wedding-hall-phone").on("click", () => {
        call(response["wedding_hall_contact"]);
      });

      $("#tel-groom-contact").on("click", () => {
        call(response["groom_contact"]);
      });

      $("#tel-groom-contact").on("click", () => {
        call(response["groom_contact"]);
      });
      $("#message-groom-contact").on("click", () => {
        message(response["groom_contact"]);
      });
      $("#tel-bride-contact").on("click", () => {
        call(response["bride_contact"]);
      });
      $("#message-bride-contact").on("click", () => {
        message(response["bride_contact"]);
      });
    },
  });
}

function call(phoneNumber) {
  location.href = "tel:" + phoneNumber;
}


function shareMessage() {
    Kakao.Share.sendScrap({
      requestUrl: 'http://localhost:5000/',
    });
  }


function message(phoneNumber) {
  location.href = "sms:" + phoneNumber;
}


//카카오톡 지도//

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.520484, 127.019182), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
geocoder.addressSearch(document.getElementById('wedding-hall-address').innerText, function(result, status) {

    // 정상적으로 검색이 완료됐으면
     if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        mapOption = {
        center: kakao.maps.LatLng(result[0].y, result[0].x), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: document.getElementById('wedding-hall-name').innerText
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    }
});

