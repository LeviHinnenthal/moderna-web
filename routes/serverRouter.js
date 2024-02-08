const express = require("express");
const router = express.Router();

/* MIDDLEWARE */

/* CONTROLLERS */
const serverController = require("../controllers/serverController");

/* REDIRECT FROM /ADMIN */
router.get("/admin", isAuthenticated, (req, res) =>
  res.redirect("/admin/home")
);

/* VIEWS */
/* ADMIN VIEW LOGIN */
router.get("/admin/auth", serverController.loginView);

/* ADMIN VIEW REGISTER */
router.get("/admin/register", serverController.registerView);

/* ADMIN VIEW HOME */
router.get("/admin/home", 
isAuthenticated,
 serverController.homeView);

/* ADMIN VIEW NEWS */
router.get("/admin/news", 
isAuthenticated,
 serverController.newsView);

/* ADMIN VIEW HIGHLIGHTS */
router.get(
  "/admin/highlights",
  isAuthenticated,
  serverController.highlightsView
);

/* ADMIN VIEW NEWS ADD */
router.get("/admin/news/add", isAuthenticated, serverController.addNewsView);

/* ADMIN VIEW PROPERTIES */
router.get(
  "/admin/properties",
  isAuthenticated,
  serverController.propertiesView
);

/* ADMIN VIEW PROPERTIES ADD */
router.get(
  "/admin/properties/add",
  isAuthenticated,
  serverController.addPropertyView
);

/* ADMIN VIEW PROPERTY EDIT */
router.get(
  "/admin/properties/edit/:id",
  isAuthenticated,
  serverController.editProperty
);

/* ADMIN VIEW PROPERTY EDIT */
router.get(
  "/admin/news/edit/:id",
  isAuthenticated,
  serverController.editNewsOne
);

/* ACTIONS */
/* ADMIN ACTION LOGOUT */
router.get("/admin/logout", serverController.logoutAction);

/* ADMIN ACTION LOGIN */
router.post("/admin/auth", serverController.loginAction);

/* ADMIN ACTION REGISTER */
router.post("/admin/register", serverController.registerAction);

/* ADMIN ACTION ADD PROPERTY */
router.post(
  "/admin/properties/add",
  isAuthenticated,
  serverController.addPropertyAction
);

/* ADMIN ACTION ADD NEWSLETTER */
router.post("/admin/news/add", isAuthenticated, serverController.addNewsAction);

/* ADMIN ACTION ADD BANNERS */
router.post("/admin/highlights", isAuthenticated, serverController.addBanners);

/* ADMIN ACTION ACTIVE/INACTIVE PROPERTY */
router.post(
  "/admin/properties",
  isAuthenticated,
  serverController.activeInactiveProperty
);

/* ADMIN ACTION HIGHLIGHT PROPERTY */
router.patch(
  "/admin/properties",
  isAuthenticated,
  serverController.highlightProperty
);

/* ADMIN ACTION ACTIVE/INACTIVE NEWSLETTER */
router.post(
  "/admin/news",
  isAuthenticated,
  serverController.activeInactiveNewsletter
);

/* ADMIN ACTION ACTIVE/INACTIVE BANNER */
router.patch(
  "/admin/highlights",
  isAuthenticated,
  serverController.activeInactiveBanner
);

/* ADMIN ACTION EDIT PROPERTY */
router.post(
  "/admin/properties/edit/",
  isAuthenticated,
  serverController.editPropertyNewData
);

/* ADMIN ACTION EDIT POST */
router.post(
  "/admin/newsletter/edit/",
  isAuthenticated,
  serverController.editNewsletterNewData
);

/* ADMIN ACTION DELETE PROPERTY */
router.delete(
  "/admin/properties",
  isAuthenticated,
  serverController.deleteProperty
);

/* ADMIN ACTION DELETE NEWSLETTER */
router.delete(
  "/admin/news",
  isAuthenticated,
  serverController.deleteNewsletter
);

/* ADMIN ACTION DELETE BANNER */
router.delete(
  "/admin/highlights",
  isAuthenticated,
  serverController.deleteBanner
);

/* ADMIN ACTION DELETE PROPERTY EDIT IMG */
router.post(
  "/admin/properties-image/delete",
  isAuthenticated,
  serverController.deleteEditImageProperty
);

/* ADMIN ACTION DELETE NEWSLETTER EDIT IMG */
router.post(
  "/admin/newsletter-image/delete",
  isAuthenticated,
  serverController.deleteEditImageNewsletter
);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/admin/auth");
}

module.exports = router;
