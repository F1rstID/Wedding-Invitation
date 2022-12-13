function call(phoneNumber) {
  location.href = "tel:" + phoneNumber;
}

function shareMessage() {
    Kakao.Share.sendScrap({
      requestUrl: 'http://localhost:5000/',
    });
  }