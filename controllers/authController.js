const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
     res.render("auth/login", { 
          pageTitle: "Login to Airbnb", 
          activePage: 'login',
          isLoggedIn: false,
          errors: [],
          oldInput: { email: "" },
          user : {},
     });
}

exports.postLogin = async (req, res, next) => {
     // console.log(req.body);
     const { email, password } = req.body;
     const user = await User.findOne({ email });
     if (!user) {
          return res.status(422).render("auth/login", {
               pageTitle: "Login to Airbnb", activePage: 'login',
               isLoggedIn: false,
               errors: ["User not found"],
               oldInput: { email },
          });
     }

     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
          return res.status(422).render("auth/login", {
               pageTitle: "Login to Airbnb", activePage: 'login',
               isLoggedIn: false,
               errors: ["Password is incorrect"],
               oldInput: { email },
               user : {},
          });
     }

     req.session.isLoggedIn = true;
     req.session.user = user;
     await req.session.save();
     res.redirect("/");
}

exports.postLogout = (req, res, next) => {
     req.session.destroy(() => {
          res.redirect("/login");
     })
}

exports.getSignup = (req, res, next) => {
     res.render("auth/signup", { 
          pageTitle: "Signup to Airbnb", 
          activePage: 'signup',
          isLoggedIn: false,
          errors: [],
          oldInput: { 
               firstname: "",
               lastname: "",
               email: "",
               password: "",
               confirmPassword: "",
               usertype: ""
          },
          user : {},
     });
}

exports.postSignup = [
     check("firstname")
     .trim()
     .isLength({min: 2})
     .withMessage("First name must be at least 2 characters long")
     .matches(/^[a-zA-Z]+$/)
     .withMessage("First name must contain only letters"),
     
     check("lastname")
     .matches(/^[a-zA-Z]+$/)
     .withMessage("Last name must contain only letters"),
     
     check("email")
     .isEmail()
     .withMessage("Invalid email address")
     .normalizeEmail(),
     
     check("password")
     .isLength({min: 8})
     .withMessage("Password must be at least 8 characters long")
     .matches(/[a-z]/)
     .withMessage("Password must contain at least one Lower case letter")
     .matches(/[A-Z]/)
     .withMessage("Password must contain at least one Upper case letter")
     .matches(/[0-9]/)
     .withMessage("Password must contain at least one number")
     .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
     .withMessage("Password must contain at least one special character")
     .trim(),
     
     check("confirmPassword")
     .trim()
     .custom((value, { req }) => {
          if (value !== req.body.password) {
               throw new Error("Passwords do not match");
          }
          return true;
     }),
     
     check("usertype")
     .notEmpty()
     .withMessage("User type is required")
     .isIn(["guest", "host"])
     .withMessage("Invalid user type"),
     
     check("terms")
     .custom((value, { req }) => {
          if (value !== "on") {
               throw new Error("You must agree to the terms and conditions");
          }
          return true;
     }),

     
     (req, res, next) => {
          const { firstname, lastname, email, password, usertype } = req.body;
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
               return res.status(422).render("auth/signup", {
                    pageTitle: "Signup to Airbnb", activePage: 'signup',
                    isLoggedIn: false,
                    errors: errors.array().map(err => err.msg),
                    oldInput: {
                         firstname, lastname, email, password, usertype
                    },
                    user : {},
               });
          }

          bcrypt.hash(password, 12).then(hashedPassword => {
               const user = new User({
                    firstname, lastname, email, password: hashedPassword, usertype
               });
               return user.save();
          }).then(() => {
               res.redirect("/login");
          }).catch(err => {
               return res.status(422).render("auth/signup", {
                    pageTitle: "Signup to Airbnb", activePage: 'signup',
                    isLoggedIn: false,
                    errors: [err.message],
                    oldInput: {
                         firstname, lastname, email, password, usertype
                    },
                    user : {},
               });
          }); 
     }
]
