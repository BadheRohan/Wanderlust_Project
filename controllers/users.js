const User = require("../models/user");



module.exports.rendersignupform  = (req, res) => {
    res.render("./Users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!!");
            res.redirect("/listings");
        });
        // console.log(registeredUser);


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderloginForm = (req, res) => {
    res.render("./Users/login.ejs")
};

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome Back to Wanderlust!! Logged In!");
        let redirectUrl = res.locals.RedirectUrl|| "/listings";
        res.redirect(redirectUrl);
    };

    module,exports.logOUt = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are LogOut");
        res.redirect("/listings")
    })
};