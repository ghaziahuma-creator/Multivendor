const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "eshop",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

exports.upload = multer({ storage: storage });