const passport = require("passport");
const formidable = require("formidable");
const {
  uploadToBucket,
  deleteFromBucket,
  readAndDeleteTemp,
} = require("../utils/s3");
const bucket = process.env.AWS_BUCKET_NAME;

/* MODELS */
const Property = require("../models/Property");
const Neighbor = require("../models/Neighbor");
const Newsletter = require("../models/Newsletter");
const Banner = require("../models/Banner");
const { handleGetStatistics } = require("./utils/controllerUtils");

const serverController = {
  /* LOGIN VIEW*/
  loginView: (req, res) => {
    res.render("server/login");
  },

  /* REGISTER VIEW*/
  registerView: (req, res) => {
    res.render("server/register");
  },
  /* HOME VIEW */
  homeView: async (req, res) => {
    try {
      let totalViewsToday = 0;
      let totalPropertiesViewThisMonth = 0;
      let totalNewsViewThisMonth = 0;
      let totalViewsThisMonth = 0;
      let dataForChart = [];
      const properties = await Property.find()
        .limit(5)
        .sort([["times_visited", -1]]);
      const newsletters = await Newsletter.find()
        .limit(5)
        .sort([["times_visited", -1]]);

      // Statistics data
      const statistics = await handleGetStatistics();
      const getThisMonthStatistics = statistics.lastRec;
      const totalStatistics = statistics.getTotalStatistics;

      // Data for chart
      totalStatistics.forEach((e) => {
        const month = new Date(e.created_on).getMonth() + 1;
        const views = e.views_this_month;
        let values = { month, views };
        dataForChart.push(values);
      });

      // Reasign
      totalViewsThisMonth = getThisMonthStatistics.views_this_month;
      totalNewsViewThisMonth =
        getThisMonthStatistics.views_this_month_newsletter;
      totalPropertiesViewThisMonth =
        getThisMonthStatistics.views_this_month_properties;
      totalViewsToday = getThisMonthStatistics.total_views_today;
      dataForChart = JSON.stringify(dataForChart);

      res.render("server/home", {
        totalViewsToday,
        totalPropertiesViewThisMonth,
        totalNewsViewThisMonth,
        totalViewsThisMonth,
        properties,
        newsletters,
        dataForChart,
      });
    } catch (error) {
      console.error(error);
    }
  },

  /* NEWS VIEW */
  newsView: async (req, res) => {
    const newsletters = await Newsletter.find();
    res.render("server/news", { posts: newsletters });
  },

  /* ADD NEWS VIEW*/
  addNewsView: (req, res) => {
    res.render("server/addNews");
  },

  /* PROPERTIES VIEW */
  propertiesView: async (req, res) => {
    const properties = await Property.find()
      .populate("neighbors")
      .sort([["created_on", -1]]);
    res.render("server/properties", { properties: properties });
  },

  /* ADD PROPERTY VIEW*/
  addPropertyView: (req, res) => {
    res.render("server/addProperty");
  },

  /* EDIT PROPERTY VIEW*/
  editProperty: async (req, res) => {
    const id = req.params.id;
    const property = await Property.findById(id).populate("neighbors");
    res.render("server/editProperty", { property: property });
  },

  /* EDIT NEWS ONE VIEW*/
  editNewsOne: async (req, res) => {
    const id = req.params.id;
    const post = await Newsletter.findById(id);
    res.render("server/editPost", { post: post });
  },

  /* HIGHLIGHTS VIEW*/
  highlightsView: async (req, res) => {
    const banners = await Banner.find();
    res.render("server/highlights", { banners: banners });
  },

  /* LOGOUT ACTION*/
  logoutAction: (req, res) => {
    req.logout();
    res.redirect("/admin/auth");
  },

  /* LOGIN ACTION*/
  loginAction: passport.authenticate("local-login", {
    successRedirect: "/admin/home",
    failureRedirect: "/admin/auth",
    failureFlash: true,
  }),

  /* LOGOUT ACTION*/
  registerAction: passport.authenticate("local-register", {
    successRedirect: "/admin/propierties",
    failureRedirect: "/admin/register",
    failureFlash: true,
    passReqToCallback: true,
  }),

  /* ADD PROPERTY ACTION*/
  addPropertyAction: async (req, res) => {
    const newProperty = new Property();
    /* GET FILES */
    let subStringProp = "propertyImage";
    let subStringArea = "areaImage";
    let subStringNeighbor = "neighbor";
    const propertyImagesArray = [];
    const areaImagesArray = [];
    const neighborsArray = [];

    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../tmp/`,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      // console.log(fields);

      /* CREATE THE PROPERTY IN DB */
      newProperty.name = fields.propertyName;
      newProperty.description = fields.propertyDescription;
      newProperty.sell_or_rent = fields.propertySellRent;
      newProperty.price = fields.propertyPrice;
      newProperty.bathroom = Number(fields.propertyBathroom);
      newProperty.room = Number(fields.propertyRoom);
      newProperty.size = Number(fields.propertySize);
      newProperty.code = fields.propertyCode;
      newProperty.type = fields.propertyType;
      newProperty.area_features = fields.areaFeatures;
      newProperty.video_url = fields.propertyVideoURL;
      newProperty.highlight = fields.propertyHighlight;
      newProperty.department = fields.propertyDepartment;
      newProperty.ubication_name = fields.propertyUbicationName;
      newProperty.ubication_lat = fields.propertyUbicationLat;
      newProperty.ubication_lng = fields.propertyUbicationLng;
      newProperty.ubication_area = fields.propertyUbicationArea;
      const arrayCharacteristics = fields.propertyCharacteristics.split("\n");
      arrayCharacteristics.forEach((tag) => {
        newProperty.property_characteristics.push(tag);
      });
      const arrayTags = fields.propertyTags.split(",");
      arrayTags.forEach((tag) => {
        newProperty.attractions_area.push(tag);
      });

      /* SAVE IMAGE IN S3 */
      Object.entries(files).forEach(async ([key, value]) => {
        // console.log(key);
        // console.log(value.originalFilename);
        if (key.includes(subStringProp)) {
          let url = await uploadToBucket(bucket, value);
          propertyImagesArray.push(url.Location);
        } else if (key.includes(subStringArea)) {
          let url = await uploadToBucket(bucket, value);
          areaImagesArray.push(url.Location);
        } else if (key.includes("primaryImg")) {
          let url = await uploadToBucket(bucket, value);
          newProperty.primary_img = url.Location;
        } else if (key.includes("secondaryImg")) {
          let url = await uploadToBucket(bucket, value);
          newProperty.secondary_img = url.Location;
        }
        //   /* SAVE ARRAY ID IN MODEL */
        newProperty.images = propertyImagesArray;
        newProperty.attractions_images = areaImagesArray;
      });

      /* CREATE THE NEIGHBOR IN DB */
      Object.entries(fields).forEach(async ([key, value]) => {
        if (key.includes(subStringNeighbor)) {
          data = JSON.parse(value);
          const newNeighbor = new Neighbor();
          newNeighbor.name = data.name;
          newNeighbor.sex = data.sex;
          newNeighbor.living_zone_stars = data.stars;
          newNeighbor.review = data.review;
          newNeighbor.property_related = newProperty.id;
          newNeighbor.save();
          neighborsArray.push(newNeighbor.id);
        }

        newProperty.neighbors = neighborsArray;
      });
    });

    /* DELETE TEMP FROM UPLOADS */
    setTimeout(async () => {
      readAndDeleteTemp();
      if (await newProperty.save()) {
        // console.log("Saved ⬇");
        // console.log(newProperty);
        res.status(200).json({
          status: "ok",
          message: "Property Saved",
          redirectURL: "/admin/properties/",
        });
      }
    }, 5000);
  },

  /* ADD NEWSLETTER ACTION*/
  addNewsAction: async (req, res) => {
    const newNewsletter = new Newsletter();

    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../tmp/`,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      newNewsletter.title = fields.newsletterTitle;
      newNewsletter.description = fields.newsletterDescription;
      newNewsletter.author = fields.newsletterAuthor;
      newNewsletter.is_active = fields.newsletterActive;
      newNewsletter.video_url = fields.newsletterVideoURL;
      newNewsletter.sub_name1 = fields.newsletterSubName1;
      newNewsletter.sub_description1 = fields.newsletterSubDescription1;
      newNewsletter.sub_name2 = fields.newsletterSubName2;
      newNewsletter.sub_description2 = fields.newsletterSubDescription2;
      newNewsletter.sub_name3 = fields.newsletterSubName3;
      newNewsletter.sub_description3 = fields.newsletterSubDescription3;
      // console.log(newNewsletter);

      if (files) {
        if (files.newsletterImagePrincipal) {
          let principal_img = await uploadToBucket(
            bucket,
            files.newsletterImagePrincipal
          );
          newNewsletter.principal_img = principal_img.Location;
        }
        if (files.newsletterImageText) {
          let text_img = await uploadToBucket(
            bucket,
            files.newsletterImageText
          );
          newNewsletter.text_img = text_img.Location;
        }
        if (files.newsletterImageSub) {
          let sub_img = await uploadToBucket(bucket, files.newsletterImageSub);
          newNewsletter.sub_img = sub_img.Location;
        }
      }
      readAndDeleteTemp();
      if (newNewsletter.save()) {
        // console.log("Saved ⬇");
        // console.log(newNewsletter);
        res.status(200).json({
          status: "ok",
          message: "Newsletter Saved",
          redirectURL: "/admin/news/",
        });
      }
    });
  },

  /* ADD BANNERS */
  addBanners: async (req, res) => {
    let filesUpload = false;

    /* GET FILES */
    let subStringDesktop = "bannerDesktop";
    let subStringMobile = "bannerMobile";

    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../tmp/`,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      Object.entries(files).forEach(async ([key, value]) => {
        if (key.includes(subStringDesktop)) {
          let url = await uploadToBucket(bucket, value);

          const newBanner = new Banner();
          newBanner.name = value.originalFilename;
          newBanner.image_url = url.Location;
          newBanner.type = "Desktop";
          /* SAVE IN DB */
          if (await newBanner.save()) {
            filesUpload = true;
          } else {
            filesUpload = false;
          }
        } else if (key.includes(subStringMobile)) {
          let url = await uploadToBucket(bucket, value);

          const newBanner = new Banner();
          newBanner.name = value.originalFilename;
          newBanner.image_url = url.Location;
          newBanner.type = "Mobile";
          /* SAVE IN DB */
          if (await newBanner.save()) {
            filesUpload = true;
          } else {
            filesUpload = false;
          }
        }
      });
    });

    /* DELETE TEMP FROM UPLOADS */
    setTimeout(() => {
      readAndDeleteTemp();
      if (filesUpload === true) {
        res.status(200).json({
          status: "ok",
          message: "Banners upload successfull",
          redirectURL: "/admin/highlights/",
        });
      }
    }, 5000);
  },

  /* ACTIVE/INACTIVE ONE PROPERTY */
  activeInactiveProperty: async (req, res) => {
    const propertySelected = await Property.findById(req.body.id);
    propertySelected.active = req.body.active;

    if (propertySelected.save()) {
      res.status(200).json({
        status: "ok",
        message: "Propiedad actualizada con éxito.",
        redirectURL: "/admin/properties",
      });
    } else {
      req.status(500).json({
        status: "error",
        errorMessage: "Error interno del servidor. Intente más tarde.",
      });
    }
  },

  /* HIGHLIGHT ONE PROPERTY */
  highlightProperty: async (req, res) => {
    const propertySelected = await Property.findById(req.body.id);
    propertySelected.highlight = req.body.highlight;

    if (propertySelected.save()) {
      res.status(200).json({
        status: "ok",
        message: "Propiedad actualizada con éxito.",
        redirectURL: "/admin/properties",
      });
    } else {
      req.status(500).json({
        status: "error",
        errorMessage: "Error interno del servidor. Intente más tarde.",
      });
    }
  },

  /* ACTIVE/INACTIVE ONE NEWSLETTER */
  activeInactiveNewsletter: async (req, res) => {
    const newsletterSelected = await Newsletter.findById(req.body.id);
    newsletterSelected.is_active = req.body.active;

    if (newsletterSelected.save()) {
      res.status(200).json({
        status: "ok",
        message: "Propiedad actualizada con éxito.",
        redirectURL: "/admin/news",
      });
    } else {
      req.status(500).json({
        status: "error",
        errorMessage: "Error interno del servidor. Intente más tarde.",
      });
    }
  },

  activeInactiveBanner: async (req, res) => {
    const bannerSelected = await Banner.findById(req.body.id);
    bannerSelected.active = req.body.active;

    if (bannerSelected.save()) {
      res.status(200).json({
        status: "ok",
        message: "Banner actualizado con éxito.",
        redirectURL: "/admin/highlights",
      });
    } else {
      req.status(500).json({
        status: "error",
        errorMessage: "Error interno del servidor. Intente más tarde.",
      });
    }
  },
  /* EDIT PROPERTY DATA*/
  editPropertyNewData: async (req, res) => {
    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../tmp/`,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      const propertyToEdit = await Property.findById(fields.id);
      // console.log(propertyToEdit.images);
      for (const prop in fields) {
        // console.log(prop);
        if (prop !== "id") {
          for (const objProp in propertyToEdit) {
            if (prop === objProp) {
              if (prop === "attractions_area") {
                propertyToEdit.attractions_area = [];
                const arrayTags = fields[prop].split(",");
                arrayTags.forEach((tag) => {
                  propertyToEdit.attractions_area.push(tag);
                });
              } else if (prop === "images") {
                propertyToEdit[objProp] = fields[prop].split(",");
              } else {
                propertyToEdit[objProp] = fields[prop];
              }
            }
          }
        }
      }

      // console.log(propertyToEdit.images);

      if (propertyToEdit.save()) {
        res.status(200).json({
          status: "ok",
          message: "Propiedad actualizada con éxito.",
          redirectURL: "/admin/properties",
        });
      } else {
        req.status(500).json({
          status: "error",
          errorMessage: "Error interno del servidor. Intente más tarde.",
        });
      }
    });
  },
  /* EDIT NEWS POST DATA*/
  editNewsletterNewData: async (req, res) => {
    const form = formidable({
      multiples: true,
      uploadDir: `${__dirname}/../tmp/`,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      const postToEdit = await Newsletter.findById(fields.id);
      // console.log(fields);
      // console.log(propertyToEdit);
      for (const prop in fields) {
        // console.log(prop);
        if (prop !== "id") {
          for (const objProp in postToEdit) {
            if (prop === objProp) {
              postToEdit[objProp] = fields[prop];
              // console.log(
              //   "propiedad para editar: " +
              //     objProp +
              //     " antiguo valor -> " +
              //     postToEdit[objProp] +
              //     " nuevo valor -> " +
              //     fields[prop]
              // );
            }
          }
        }
      }

      if (postToEdit.save()) {
        res.status(200).json({
          status: "ok",
          message: "Post actualizado con éxito.",
          redirectURL: "/admin/news",
        });
      } else {
        req.status(500).json({
          status: "error",
          errorMessage: "Error interno del servidor. Intente más tarde.",
        });
      }
    });
  },

  /* DELETE ONE PROPERTY */
  deleteProperty: async (req, res) => {
    const propertySelected = await Property.findById(req.body.id);

    const bucketFile = function (file) {
      return file.split(".com/")[1];
    };

    if (propertySelected.images.length > 0) {
      propertySelected.images.forEach(async (img) => {
        await deleteFromBucket(bucket, bucketFile(img));
      });
    }

    if (propertySelected.attractions_images.length > 0) {
      propertySelected.attractions_images.forEach(async (img) => {
        await deleteFromBucket(bucket, bucketFile(img));
      });
    }

    if (propertySelected.delete()) {
      res.status(200).json({
        status: "ok",
        message: "Propiedad borrada con éxito.",
        redirectURL: "/admin/properties",
      });
    } else {
      req.status(500).json({
        status: "error",
        errorMessage: "Error interno del servidor. Intente más tarde.",
      });
    }
  },

  /* DELETE ONE NEWSLETTER */
  deleteNewsletter: async (req, res) => {
    const newsletterSelected = await Newsletter.findById(req.body.id);

    const bucketFile = function (file) {
      return file.split(".com/")[1];
    };

    if (newsletterSelected.principal_img) {
      await deleteFromBucket(
        bucket,
        bucketFile(newsletterSelected.principal_img)
      );
    }
    if (newsletterSelected.text_img) {
      await deleteFromBucket(bucket, bucketFile(newsletterSelected.text_img));
    }
    if (newsletterSelected.sub_img) {
      await deleteFromBucket(bucket, bucketFile(newsletterSelected.sub_img));
    }

    if (newsletterSelected.delete()) {
      res.status(200).json({
        status: "ok",
        message: "Propiedad borrada con éxito.",
        redirectURL: "/admin/news",
      });
    } else {
      req.status(500).json({
        status: "error",
        errorMessage: "Error interno del servidor. Intente más tarde.",
      });
    }
  },

  /* DELETE ONE BANNER */
  deleteBanner: async (req, res) => {
    const bannerSelected = await Banner.findById(req.body.id);

    urlFile = bannerSelected.image_url;

    const bucketFile = function (file) {
      return file.split(".com/")[1];
    };

    await deleteFromBucket(bucket, bucketFile(urlFile));

    if (bannerSelected.delete()) {
      res.status(200).json({
        status: "ok",
        message: "Banner borrado con éxito.",
        redirectURL: "/admin/highlights",
      });
    } else {
      req.status(500).json({
        status: "error",
        errorMessage: "Error interno del servidor. Intente más tarde.",
      });
    }
  },

  /* DELETE EDIT PROPERTY IMG */
  deleteEditImageProperty: async (req, res) => {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      urlFile = fields.url;

      const bucketFile = function (file) {
        return file.split(".com/")[1];
      };

      await deleteFromBucket(bucket, bucketFile(urlFile));

      const propertySelected = await Property.findById(fields.id);

      if (fields.type === "property") {
        let newArray = await propertySelected.images.filter(
          (img) => img !== fields.url
        );
        propertySelected.images = newArray;
      } else {
        let newArray = await propertySelected.attractions_images.filter(
          (img) => img !== fields.url
        );
        propertySelected.attractions_images = newArray;
      }

      if (propertySelected.save()) {
        // console.log(propertySelected);
        res.status(200).json({
          status: "ok",
        });
      } else {
        req.status(500).json({
          status: "error",
          errorMessage: "Error interno del servidor. Intente más tarde.",
        });
      }
    });
  },

  /* DELETE EDIT NEWSLETTER IMG */
  deleteEditImageNewsletter: async (req, res) => {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      urlFile = fields.url;

      const bucketFile = function (file) {
        return file.split(".com/")[1];
      };

      await deleteFromBucket(bucket, bucketFile(urlFile));

      const postSelected = await Newsletter.findById(fields.id);

      if (fields.type === "principal") {
        postSelected.principal_img = "";
      }
      if (fields.type === "text") {
        postSelected.text_img = "";
      }
      if (fields.type === "sub") {
        postSelected.sub_img = "";
      }

      if (postSelected.save()) {
        // console.log(propertySelected);
        res.status(200).json({
          status: "ok",
        });
      } else {
        req.status(500).json({
          status: "error",
          errorMessage: "Error interno del servidor. Intente más tarde.",
        });
      }
    });
  },
};

module.exports = serverController;
