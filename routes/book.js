const express = require("express");
const router = express.Router();
const multer = require("multer");
const Listing = require("../models/listing");



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "Uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });

const upload = multer({ storage: storage });

router.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const books = await Listing.findById(id);
    if (!books) {
      return res.status(404).send("Book not found");
    }
    return res.status(200).json(books); // Send the data
  } catch (error) {
    return res.status(500).send("Error in getting book");
  }
});


router.post("/books", upload.array("images", 3), async (req, res) => {
  try {
    const newListing = new Listing(req.body);

    if (req.files.length <= 0) {
      return res.status(400).send("No files were uploaded");
    }
    if (req.body.forSaleData != "rent") {
      newListing.forRent = false;
      newListing.forSale = true;
    }
    
    const imageArray = [];

    // 1. Push image URL (from API) as first image
    if (req.body.thumbnailUrl) {
      imageArray.push({
        url: req.body.thumbnailUrl,
        filename: req.body.title, // or some label like 'external'
      });
    }

    // 2. Push uploaded images
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        imageArray.push({
          url: `uploads/${file.filename}`,
          filename: file.filename,
        });
      });
    }

    newListing.images = imageArray;

    // Save the paths of the uploaded images
    await newListing.save();
    res.status(201).send("Book details added successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error uploading files");
  }
});


router.get("/browse", async (req, res) => {
  try {
    const allListing = await Listing.find({});
    return res.status(200).json(allListing); // Send the data
  } catch (error) {
    return res.status(500).send("Error in uploading browse page");
  }
});

module.exports = router;