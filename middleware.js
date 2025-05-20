 const Listing = require("./models/listing");
const Review = require("./models/reviews");
 const ExpressError = require("./Utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create  listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if( req.session.redirectUrl){
        res.locals.RedirectUrl = req.session.redirectUrl ;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
     let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","You dont't have permission to edit");
        return  res.redirect(`/listings/${id}`);
    }
    next()
};
// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);

//     if (error) {
//        let errMsg = error.details.map((el) =>el.message).join(",");
//     } else {
//         next();
//     }
// }

//review Middleware
module.exports.validateReview = async(req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    else {
        next()
    }
};
module.exports.isreviewauthor = async(req,res,next) => {
     let {id, reviewId } = req.params;
    let reviews = await Review.findById(reviewId);
    if(!reviews.author.equals(res.locals.curruser._id)){
        req.flash("error","You dont't have permission to delete");
        return  res.redirect(`/listings/${id}`);
    }
    next()
};