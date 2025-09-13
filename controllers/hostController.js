const path = require('path');
const rootDir = require('../utils/pathUtil');
const Home = require('../models/home');
const fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, path.join(rootDir, 'uploads'));
     },
     filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname);
     }
});


exports.getAddHome = (req, res, next) => {
     res.render("host/edit-homes", { pageTitle: "Add Home to Airbnb", activePage: 'add-home', 
     action:false,
     isLoggedIn: req.isLoggedIn,
     user: req.session.user,
     });
}

exports.postAddHome = (req, res, next) => {
     const { houseName, homeLocation, contactInfo, pricePerNight, rating, description } = req.body;
     const photoPaths = req.files ? req.files.map(file => file.filename) : [];

     const home = new Home({ houseName, homeLocation, contactInfo, pricePerNight, rating, photos: photoPaths, // Use 'photos' (plural) and pass the array of paths
          description
     });

     try {
          home.save();
          console.log('Home added successfully');
          res.redirect("/host/host-home-list");
     } catch (err) {
          console.error('Error adding home:', err);
          next(err);
     }
}

exports.getHostHomes = (req, res, next) => {
     Home.find().then(homesData => {
          // console.log(homesData);
          res.render("host/host-home-list", { homesData, pageTitle: 'Host Homes List', activePage: 'host-home-list',
          isLoggedIn: req.isLoggedIn,
          user: req.session.user,
          });
     });
}


exports.getEditHomes = (req, res, next) => {
     const homeId = req.params.homeId;
     const action = req.query.action === 'edit';
     Home.findById(homeId).then(home => {
          if (home) {
               res.render("host/edit-homes", { 
                    pageTitle: "Edit Your Home", activePage: 'host-home-list', 
                    home: home, 
                    action:action,
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user,
               });
          } else {
               res.redirect("/host-home-list");
          }
     });
}



exports.postEditHomes = (req, res, next) => {
     const { id, houseName, homeLocation, contactInfo, pricePerNight, rating, description } = req.body;
     
     const home = Home.findById(id).then(home => {
          home.houseName = houseName;
          home.homeLocation = homeLocation;
          home.contactInfo = contactInfo;
          home.pricePerNight = pricePerNight;
          home.rating = rating;
          home.description = description;
          if (req.files && req.files.length > 0) {
               fs.unlink(path.join(rootDir, 'uploads', home.photos[0]), (err) => {
                    if (err) {
                         console.error('Error deleting old photo:', err);
                    }
               });
               const newPhotoPaths = req.files.map(file => file.filename);
               home.photos = newPhotoPaths;
          }
          home.save().then((result) => {
               console.log('Home updated successfully', result);
          }).catch((err) => {
               console.error('Error updating home:', err);
          })
          res.redirect("/host/host-home-list");
     }).catch((err) => {
          console.error('Error finding home:', err);
     });
};


exports.postDeleteHome = (req, res, next) => {
     const homeId = req.params.homeId;
     // Just for delete photo when i delete hoem 
     const home = Home.findById(homeId).then(home => {
          if (home) {
               home.photos.forEach(photoPath => {
                    const filePath = path.join(rootDir, 'uploads', photoPath);
                    fs.unlink(filePath, (err) => {
                         if (err) {
                              console.error('Error deleting photo:', err);
                         }
                    });
               });
          }
     });  
     Home.findByIdAndDelete(homeId).then(() => {
          res.redirect("/host/host-home-list");
     }).catch((err) => {
          console.error(err);
          res.redirect("/host/host-home-list");
     });
};



exports.storage = storage;
