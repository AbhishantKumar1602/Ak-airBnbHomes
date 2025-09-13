const Home = require('../models/home');
const User = require('../models/user');
// const Favourite = require('../models/favourite');
const { ObjectId } = require('mongodb');


exports.getIndex = (req, res, next) => {
     // console.log("Session Value: ", req.session);
     Home.find().then((homeData) => {
          res.render("store/index", { 
               homesData: homeData, 
               pageTitle: 'Airbnb Home', 
               activePage: 'airbnb-home', 
               isLoggedIn: req.isLoggedIn,
               user: req.session.user, 
          });
     });
}

exports.getHomes = (req, res, next) => {
     Home.find().then((homeData) => {
          res.render("store/home-list", { 
               homesData: homeData, 
               pageTitle: 'Homes List', 
               activePage: 'homes-list', 
               isLoggedIn: req.isLoggedIn, 
               user: req.session.user,
          });
     });
}

exports.getHomeDetails = (req, res, next) => {
     const homeId = req.params.homeId;
     if (!ObjectId.isValid(homeId)) {
          console.log("Invalid Home ID format in getHomeDetails:", homeId);
          return res.redirect("/homes");
     }
     Home.findById(homeId).then((homes) => {
          if (!homes) {
               console.log("Home not found");
               res.redirect("/homes");
          }else {
               res.render("store/home-detail", { 
                    home: homes, 
                    pageTitle: homes.houseName, activePage: 'homes-list', 
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user,
               });
          }
     });
}

exports.getBookings = (req, res, next) => {
     res.render('store/booking-list', { 
          pageTitle: 'Booking List', 
          activePage: 'bookings', 
          isLoggedIn: req.isLoggedIn,
          user: req.session.user, });
}


exports.getFavoriteList = async (req, res, next) => {
     const userId = req.session.user._id;
     const user = await User.findById(userId).populate('favourites');
     res.render("store/favourite-list", { 
          favouriteHomes: user.favourites, 
          pageTitle: 'My Favourite', 
          activePage: 'favourite', 
          isLoggedIn: req.isLoggedIn,
          user: req.session.user,
     });
};

exports.postAddToFavourite = async (req, res, next) => {
     const homeId = req.body.homeId;
     const userId = req.session.user._id;
     const user = await User.findById(userId);

     if (!user.favourites.includes(homeId)) {     
          user.favourites.push(homeId);
          await user.save();
     }
     res.redirect("/favourite");
}

exports.postRemoveHome = async (req, res, next) => {
     const homeId = req.params.homeId;
     const userId = req.session.user._id;
     const user = await User.findById(userId);

     if (user.favourites.includes(homeId)) {
          user.favourites = user.favourites.filter(fav => fav != homeId);
          await user.save();
     }
     return res.redirect("/favourite");
};
