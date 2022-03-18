const form = document.querySelector("#form");
const inputfile = document.querySelector("#file");
const uploadfile = document.querySelector(".upload-file");
const uplaodedfile = document.querySelector(".uploaded");
const responsefield = document.querySelector("#resultsfeed");

//log selected file
inputfile.onchange = (e) => {
  const filename = e.target.files[0].name;
  console.log(filename);

  //AJAX post request to server
  let ajaxoostrequest = new XMLHttpRequest();
  ajaxoostrequest.open("POST", "uploads", true);

  //implement progress dialog function, //on progress, return data being sent tthe server
  ajaxoostrequest.upload.onprogress = ({ loaded, total }) => {
    console.log(loaded, total);
    //converting bytes to kilobytes
    loadedKb = Math.floor(loaded / 1000);
    totalKb = Math.floor(total / 1000);

    //log upload progress
    console.log(loadedKb, totalKb);

    //calc %age progress
    percent = Math.floor((loadedKb / totalKb) * 100);

    //upload file formsection
    uploadfile.innerHTML = `
        <i class="fas fa-file-alt"></i>
        <div class="content">
        <div>
          <span>${filename}</span>
          <span>Uploading.. ${percent}</span>
          </div>
          <div style="width: ${percent}% " class="progress-bar"></div>
        </div>`;
  };

  //server response
  ajaxoostrequest.onload = (e) => {
    const { err } = JSON.parse(ajaxoostrequest.response);
    if (err) {
      console.log(err);
      const { name, message } = err;
      alert(name + " " + message);
      return;
    }

    if ((loadedKb = totalKb)) {
      uploadfile.innerHTML = "";

      //uploaded content form section
      let uploadedContent = `
          <div class="upload-file">
          <i class="fas fa-file-alt"></i>
          <div class="content">
            <div>
              <span>${filename}</span>
              <i class="fas fa-check"></i>
            </div>
            <div class="size">${totalKb}kb</div>
          </div>
        </div>`;

      uplaodedfile.insertAdjacentHTML("afterbegin", uploadedContent);
    }
  };

  //instantiet formdata and send form ajax reg
  let formdata = new FormData(form);
  ajaxoostrequest.send(formdata);
};
