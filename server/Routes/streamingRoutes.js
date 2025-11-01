const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4 } = require("uuid");
const fs = require("fs");
const { exec } = require("child_process"); // watch out
const { stderr, stdout } = require("process");
const router = express.Router();
router.use(express.json());
const {
  uploadToCloudinary,
  streamFromCloudinary,
} = require("../Controllers/streamControllers.js");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

// multer configuration
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadToCloudinary);
router.post("/streaming", streamFromCloudinary);

module.exports = router;
