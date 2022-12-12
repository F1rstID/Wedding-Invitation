const url = "http://127.0.0.1:5500/project01/templates";

function onClickedImageUpload() {
  const imageInputElement = document.getElementById("main-img-input-file");

  imageInputElement.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      let imageElement = document.querySelector(".main-wedding-img");
      imageElement.style.backgroundImage = `url(${fileReader.result})`;
    };

    fileReader.readAsDataURL(file);
  });
}

function showPreview() {
  location.href = url + "/preview.html";
}

function editSave() {}
