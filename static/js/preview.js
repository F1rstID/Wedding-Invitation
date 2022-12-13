window.addEventListener("load", () => {
    getAllData();
});
let getEmail

function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getAllData() {
    //api/load/email
    $.ajax({
        type: "GET",
        url: "/api/load/<email>",
        data: {},
        success: function (response) {
            getEmail = getParameter("email")

            let main_title = getParameter('main_title')
            let image_url = getParameter('image_url')
            let groom_name = getParameter('groom_name')
            let bride_name = getParameter('bride_name')
            let wedding_date = getParameter('wedding_date')
            let wedding_detail_location = getParameter('wedding_detail_location')
            let invitation_parases = getParameter('invitation_parases')
            let groom_father_name = getParameter('groom_father_name')
            let groom_mother_name = getParameter('groom_mother_name')
            let bride_father_name = getParameter('bride_father_name')
            let bride_mother_name = getParameter('bride_mother_name')
            let wedding_hall_name = getParameter('wedding_hall_name')
            let wedding_hall_address = getParameter('wedding_hall_address')
            let wedding_hall_contact = getParameter('wedding_hall_contact')
            let groom_contact = getParameter('groom_contact')
            let bride_contact = getParameter('bride_contact')



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
        requestUrl: 'http://f1rstweb.shop/api/load/' + getEmail,
    });
    console.log(getEmail)
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
geocoder.addressSearch(document.getElementById('wedding-hall-address').innerText, function (result, status) {

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

