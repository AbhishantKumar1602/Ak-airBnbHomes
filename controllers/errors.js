
exports.PageNotFound404 = (req, res, next) => {
     res.status(404).render("404", { 
          pageTitle: "404 - Page Not Found", 
          activePage: '',     
          isLoggedIn: req.isLoggedIn,
          user: req.session.user,
     });
}
