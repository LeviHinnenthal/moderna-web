const express = require("express");
const router = express.Router();

/* CONTROLLERS */
const clientController = require("../controllers/clientController");

/* CLIENT HOME */
router.get("/", clientController.home);
/* CLIENT ALL PROPERTIES */
router.get("/properties", clientController.properties);
/* CLIENT ALL PROPERTIES RAW DATA*/
router.get("/properties-raw", clientController.propertiesRawData);
/* CLIENT ONE PROPERTY */
router.get("/property/:id", clientController.property);
/* CLIENT ALL NEWSLETTER */
router.get("/newsletter", clientController.newsletter);
/* CLIENT ONE NEWSLETTER */
router.get("/newsletter/:id", clientController.newsletterOne);
/* CLIENT ASESORY */
router.get("/asesory", clientController.asesory);
/* CLIENT ABOUT US */
router.get("/about", clientController.aboutUs);
/* CLIENT GET FORM CONTACT */
router.post("/contact", clientController.getEmailContact);
/* CLIENT GET MORE PROPERTIES VIEW PROPERTIES */
router.post("/properties", clientController.getMoreProperties);
/* CLIENT GET MORE PROPERTIES VIEW HOME*/
router.post("/", clientController.getMorePropertiesForHome);
/* CLIENT GET MORE NEWSLETTER VIEW NEWSLETTER*/
router.post("/newsletter", clientController.getMoreNewsletters);
/* CLIENT GET SEARCH PROPERTIES WITH PARAMS*/
router.get("/search/:data", clientController.searchProperties);
/* CLIENT UNSUBSCRIBE TO NEWSLETTER*/
router.post("/subscribe", clientController.subscribe);

module.exports = router;
