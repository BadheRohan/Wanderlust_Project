const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../Utils/wrapAsync");
const flash = require("connect-flash");
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js");
const { signUp, rendersignupform, renderloginForm, login, logOUt } = require("../controllers/users.js");


router
.route("/signup",)
.get(rendersignupform)
.post(wrapAsync(signUp)
);

//login Routes

router.
route("/login")
.get(renderloginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true })
    ,login);

//logout Routes
router.get("/logout", logOUt)

module.exports = router;