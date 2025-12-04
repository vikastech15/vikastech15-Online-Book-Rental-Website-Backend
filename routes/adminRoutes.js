const express = require("express");
const Listing = require("../models/listing");
const User = require("../models/users");
const router = express.Router();
const cloudinary = require("../config/cloudinary");

// ----- LISTING (BOOKS) CRUD -----

// Create a new book
router.post("/books", async (req, res) => {
  try {
    const newBook = new Listing(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: "Failed to create book" });
  }
});

// Read all books
router.get("/books", async (req, res) => {
  try {
    const allListing = await Listing.find({});
    res.status(200).json(allListing);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Read a single book by ID
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Listing.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: "Error fetching book" });
  }
});

// Update a book
router.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: "Failed to update book" });
  }
});

// Delete a book
// router.delete("/books/:id", async (req, res) => {
//   try {
//     const deletedBook = await Listing.findByIdAndDelete(req.params.id);
//     if (!deletedBook) return res.status(404).json({ error: "Book not found" });
//     res.status(200).json({ message: "Book deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete book" });
//   }
// });
// Delete a book
router.delete("/books/:id", async (req, res) => {
  try {
    const book = await Listing.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Delete all images from Cloudinary
    if (book.images && book.images.length > 0) {
      for (const img of book.images) {
        if (img.filename) {
          await cloudinary.uploader.destroy(img.filename);
        }
      }
    }

    // Delete the book from MongoDB
    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Book deleted successfully (images removed from Cloudinary)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// ----- USER CRUD -----

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: "Failed to create user" });
  }
});

// Read all users
router.get("/users", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.status(200).json(allUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Read a single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

// Update a user
router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: "Failed to update user" });
  }
});

// Delete a user
// router.delete("/users/:id", async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) return res.status(404).json({ error: "User not found" });
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete user" });
//   }
// });
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent deletion if it's the admin email
    if (user.email === "vikasvermagupta2@gmail.com") {
      
      return res.status(403).json({ error: "Cannot delete admin account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});


module.exports = router;
