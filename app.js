if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express")
const app = express();
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./Utils/ExpressError.js");
const Review = require("./models/reviews.js");
const path = require("path");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require("./models/user.js");
const reviewsRouter = require("./routes/review.js");
const listingsRouter = require("./routes/listing.js")
const userRouter = require("./routes/user.js");

const db_url = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB")
}).catch((err => {
    console.log(err);
}));

async function main() {
    await mongoose.connect(db_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create({
    mongoUrl: db_url,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("error in mongpo session store",err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user; 
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter)


// //middleware for error handling
// app.all('*',(req,res,next) =>{
//     next(new ExpressError(404,"page not found"));
// });

app.use((err, req, res, next) => {
    let { statuscode, message } = err;
    res.render("error.ejs", { message });
});


const port = process.env.PORT;
if (!port) {
  throw new Error("PORT not defined in environment");
}

app.listen(port, () => {
  console.log(`✅ Server is listening on port ${port}`);
});

