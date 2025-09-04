
const express = require("express");
const router = express.Router();
const { login, signup, checkuser, profile, editProfile } = require("../controllers/userController");

router.post("/signup", signup);

router.post("/login", login );

router.post("/check-user", checkuser)

router.get("/profile", profile)

router.put("/edit-profile", editProfile)

module.exports = router;
