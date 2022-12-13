let imageData = "";

window.addEventListener("load", () => {
  setupBind();
  getAllData();

  $("#menu_wrap").hide();
});

function getAllData() {
  $.ajax({
    type: "GET",
    url: "/api/load",
    data: {},
    success: function (response) {
      console.log("123123", response);
      $("#main-title-textarea").val(response["main_title"]);

      let imageElement = document.querySelector(".main-wedding-img");
      // imageElement.style.backgroundImage = `url(${response["image_url"]})`;
      imageElement.style.backgroundImage = response["image_url"];

      $("#floating-input-groom").val(response["groom_name"]);
      $("#floating-input-bride").val(response["bride_name"]);
      $("#groom-name").val(response["groom_name"]);
      $("#bride-name").val(response["bride_name"]);
      $("#floating-input-detail-date").val(response["wedding_date"]);
      $("#floating-input-detail-location").val(
        response["wedding_detail_location"]
      );
      $("#invite-phrases-textarea").val(response["invitation_parases"]);
      $("#groom-father-name").val(response["groom_father_name"]);
      $("#groom-mother-name").val(response["groom_mother_name"]);
      $("#bride-father-name").val(response["bride_father_name"]);
      $("#bride-mother-name").val(response["bride_mother_name"]);

      $("#wedding-hall-name").val(response["wedding_hall_name"]);
      $("#wedding-hall-address").val(response["wedding_hall_address"]);
      $("#wedding-hall-phone").val(response["wedding_hall_contact"]);

      $("#input-groom-contact").val(response["groom_contact"]);
      $("#input-bride-contact").val(response["bride_contact"]);
    },
  });
}

function onClickedImageUpload() {
  const imageInputElement = document.getElementById("main-img-input-file");
  const getimage = document.getElementById("main-img-input-file").value;
  imageInputElement.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      let imageElement = document.querySelector(".main-wedding-img");
      imageElement.style.backgroundImage = `url(${fileReader.result})`;

      imageData = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  });
}

function setupBind() {
  $("#floating-input-groom").change((e) => {
    $("#groom-name").val(e.target.value);
  });
  $("#groom-name").change((e) => {
    $("#floating-input-groom").val(e.target.value);
  });
  $("#floating-input-bride").change((e) => {
    $("#bride-name").val(e.target.value);
  });
  $("#bride-name").change((e) => {
    $("#floating-input-bride").val(e.target.value);
  });
}

function showPreview() {
  location.href = url + "/preview.html";
}

function editSave() {
  let mainTitle = $("#main-title-textarea").val();
  let groomName = $("#floating-input-groom").val();
  let brideName = $("#floating-input-bride").val();
  let weddingDate = $("#floating-input-detail-date").val();
  let weddingHallDetailLocation = $("#floating-input-detail-location").val();

  let invitationParases = $("#invite-phrases-textarea").val();
  let groomFatherName = $("#groom-father-name").val();
  let groomMotherName = $("#groom-mother-name").val();
  let brideFatherName = $("#bride-father-name").val();
  let brideMotherName = $("#bride-mother-name").val();

  let weddingHallName = $("#wedding-hall-name").val();
  let weddingHallAddress = $("#wedding-hall-address").val();
  let weddingHallPhone = $("#wedding-hall-phone").val();

  let groomContact = $("#input-groom-contact").val();
  let brideContact = $("#input-bride-contact").val();

  doc = {
    main_title: mainTitle,
    image_url: imageData,
    groom_name: groomName,
    bride_name: brideName,
    wedding_date: weddingDate,
    wedding_detail_location: weddingHallDetailLocation,

    invitation_parases: invitationParases,
    groom_father_name: groomFatherName,
    groom_mother_name: groomMotherName,
    bride_father_name: brideFatherName,
    bride_mother_name: brideMotherName,

    wedding_hall_name: weddingHallName,
    wedding_hall_address: weddingHallAddress,
    wedding_hall_contact: weddingHallPhone,

    groom_contact: groomContact,
    bride_contact: brideContact,
  };

  $.ajax({
    type: "POST",
    url: "/api/save",
    data: { data_give: JSON.stringify(doc) },
    success: function (response) {
      console.log(response);
    },
  });

  /////////////////////////////////////////////////////////////////
  //============================ Map =====================

  // 마커를 담을 배열입니다
  var markers = [];

  var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 장소 검색 객체를 생성합니다
  var ps = new kakao.maps.services.Places();

  // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

  // 키워드 검색을 요청하는 함수입니다
  function searchPlaces() {
    var keyword = document.getElementById("wedding-hall-name").value;

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB);
  }

  // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
  function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출합니다
      displayPlaces(data);

      // 페이지 번호를 표출합니다
      displayPagination(pagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      return;
    }
  }

  // 검색 결과 목록과 마커를 표출하는 함수입니다
  function displayPlaces(places) {
    var listEl = document.getElementById("placesList"),
      menuEl = document.getElementById("menu_wrap"),
      fragment = document.createDocumentFragment(),
      bounds = new kakao.maps.LatLngBounds(),
      listStr = "";

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    for (var i = 0; i < 1; i++) {
      // 마커를 생성하고 지도에 표시합니다
      var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
        marker = addMarker(placePosition, i),
        itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다
      (function (marker, title) {
        kakao.maps.event.addListener(marker, "mouseover", function () {
          displayInfowindow(marker, title);
        });

        kakao.maps.event.addListener(marker, "mouseout", function () {
          displayInfowindow(marker, title);
        });

        itemEl.onmouseover = function () {
          displayInfowindow(marker, title);
        };

        itemEl.onmouseout = function () {
          infowindow.close();
        };
      })(marker, places[i].place_name);

      fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
  }

  // 검색결과 항목을 Element로 반환하는 함수입니다
  function getListItem(index, places) {
    var el = document.createElement("li"),
      itemStr =
        '<span class="markerbg marker_' +
        (index + 1) +
        '"></span>' +
        '<div class="info">' +
        "   <h5>" +
        places.place_name +
        "</h5>";

    if (places.road_address_name) {
      itemStr +=
        "    <span>" +
        places.road_address_name +
        "</span>" +
        '   <span class="jibun gray">' +
        places.address_name +
        "</span>";
    } else {
      itemStr += "    <span>" + places.address_name + "</span>";
    }

    itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";

    el.innerHTML = itemStr;
    el.className = "item";

    return el;
  }

  // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
  function addMarker(position, idx, title) {
    var imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
      });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker); // 배열에 생성된 마커를 추가합니다

    return marker;
  }

  // 지도 위에 표시되고 있는 마커를 모두 제거합니다
  function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
  function displayPagination(pagination) {
    var paginationEl = document.getElementById("pagination"),
      fragment = document.createDocumentFragment(),
      i;

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
      paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
      var el = document.createElement("a");
      el.href = "#";
      el.innerHTML = i;

      if (i === pagination.current) {
        el.className = "on";
      } else {
        el.onclick = (function (i) {
          return function () {
            pagination.gotoPage(i);
          };
        })(i);
      }

      fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
  }

  // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
  // 인포윈도우에 장소명을 표시합니다
  function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

    infowindow.setContent(content);
    infowindow.open(map, marker);
  }

  // 검색결과 목록의 자식 Element를 제거하는 함수입니다
  function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
  }
}
