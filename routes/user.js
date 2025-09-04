// routes/address.js
const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Save (or update) delivery addresses for a user by email
router.post("/save-addresses", async (req, res) => {
  const { email, addresses } = req.body;

  if (!email || !addresses || !Array.isArray(addresses)) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  if (addresses.length < 1 || addresses.length > 3) {
    return res.status(400).json({ message: "Address count must be between 1 and 3." });
  }

  console.log(email)
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    user.deliveryAddresses = addresses;
    await user.save();

    res.status(200).json({ message: "Addresses updated successfully.", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/get-address", async (req, res) => {
  try {
    const {email} = req.body;
    if (!email) return res.status(404).json({ message: "User not found." });
    const user = await User.findOne({ email });
    const address = user.deliveryAddresses;

    res.status(200).json({ message: "Success", address})

  } catch(err) {
    res.status(200).json({ message: "Server Error", error: err.message})
    console.log("Error: ", error)
  }

})

// Delete an address for a user by index
router.delete("/delete-address", async (req, res) => {
  const { email, index } = req.body;

  if (!email || typeof index !== 'number') {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.deliveryAddresses || index < 0 || index >= user.deliveryAddresses.length) {
      return res.status(400).json({ message: "Invalid address index." });
    }

    user.deliveryAddresses.splice(index, 1); // remove address at index
    await user.save();

    res.status(200).json({ message: "Address deleted successfully.", addresses: user.deliveryAddresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
