const express = require("express"); // for server side logic
const multer = require("multer"); //use middleware for handling multiform  data/images/files
const request = require("request"); //derecated, alternatives: Axios, Native
const fs = require("fs"); //for file management
const path = require("path");

const app = express();
var router = express.Router();
// for http request to endpoint
const { response } = require("express");

//serving web on the express server
app.use("/", express.static(path.join(__dirname, "web")));

//post route ,uploads folder
app.post("/uploads", (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, res, mycallbackfunc) {
      mycallbackfunc(null, __dirname + "/uploads/");
    },
    filename: function (req, file, mycallbackfunc) {
      mycallbackfunc(null, file.originalname);
    },
  });

  // ROOM FOR IMPROVEMENT:--------- handling file sizes by adding stoarge multer arguement
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, mycallbackfunc) {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        mycallbackfunc(null, true); //proceeds without error
      } else {
        // ROOM FOR IMPROVEMENT:--------- Todo return error to front end
        //creating custom erroR message
        const err = new Error();
        err.name = "File type error";
        err.message =
          "Selected file type not allowed.Please upload only jpg,jpeg or png file types";

        return mycallbackfunc(err, false);
      }
    },
  }).single("images"); //name of the input file

  upload(req, res, (err) => {
    console.log(req.file);

    //For upload error handling
    if (err) {
      console.log(err);
      res.json({ err });
      return;
    }

    console.log("File upload to backend was sucessful");
    res.status(200).json({ "msg: 200": "file uploaded..status code 200" });

    //Api request to endpoint
    var options = {
      method: "POST",
      //// ROOM FOR IMPROVEMENT:---------can be accessed as .env
      url: "https://2sp6lmzjdd.execute-api.eu-west-2.amazonaws.com/dev/defect-detection",
      headers: {},
      formData: {
        image: {
          value: fs.createReadStream(req.file.path),
          options: {
            filename: "",
            contentType: "application/json",
          },
        },
      },
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);

      console.log(response.body);
    });
    res.end; //End request
  });
});

//instantiate port and start listening
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is listening to PORT...${PORT}`));
