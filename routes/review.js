const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../Utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const{validateReview,isLoggedIn,isreviewauthor} = require("../middleware.js");
const {createReview, deleteReview} = require("../controllers/review.js")


//reviews :-
//post/create  route-
router.post("/",isLoggedIn, validateReview,wrapAsync(createReview));

//Delete Review Route 
router.delete("/:reviewId",isLoggedIn,isLoggedIn,isreviewauthor, wrapAsync(deleteReview));

module.exports = router;
