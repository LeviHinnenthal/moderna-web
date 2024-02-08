const emailjs = require("emailjs-com");
const formidable = require("formidable");
const { addSubscriber } = require("../utils/mailChimp");

/* MODELS */
const Property = require("../models/Property");
const Neighbor = require("../models/Neighbor");
const Newsletter = require("../models/Newsletter");
const Banner = require("../models/Banner");
const { handleUpdateStatistics } = require("./utils/controllerUtils");
const clientController = {
  /* HOME */
  home: async (req, res) => {
    await handleUpdateStatistics();
    const banners = await Banner.find();
    let bannnersToShow = {};
    bannnersToShow.mobile = [];
    bannnersToShow.desktop = [];

    banners.forEach((ban) => {
      if (ban.type === "Mobile" && ban.active === true) {
        bannnersToShow.mobile.push(ban);
      }
      if (ban.type === "Desktop" && ban.active === true) {
        bannnersToShow.desktop.push(ban);
      }
    });
    const newsletters = await Newsletter.find()
      .limit(10)
      .sort([["created_on", -1]]);
    let activeNewsletters = [];
    newsletters.forEach((post) => {
      if (post.is_active === true) {
        activeNewsletters.push(post);
      }
    });

    const properties = await Property.find()
      .populate("neighbors")
      .sort([["created_on", -1]]);
    let activeProperties = [];
    properties.forEach((pro) => {
      if (pro.active === true && pro.highlight === true) {
        activeProperties.push(pro);
      }
    });

    res.render("client/home", {
      properties: activeProperties,
      newsletters: activeNewsletters,
      banners: bannnersToShow,
    });
  },
  /* ONE PROPERTY */
  property: async (req, res) => {
    const id = req.params.id;
    await handleUpdateStatistics(id, "property");
    const property = await Property.findById(id).populate("neighbors");
    const propertiesArray = await Property.find().populate("neighbors");
    const propertiesActivesArray = [];
    let deleteDuplicates;

    propertiesArray.forEach((prop) => {
      if (prop.active === true) propertiesActivesArray.push(prop);
    });

    for (i = 0; i <= 2; i++) {
      const position = Math.floor(
        Math.random() * propertiesActivesArray.length
      );
      propertiesActivesArray.push(propertiesActivesArray[position]);
    }

    deleteDuplicates = propertiesActivesArray.filter((prop, i) => {
      return propertiesActivesArray.indexOf(prop) === i;
    });

    res.render("client/property", {
      property: property,
      properties: deleteDuplicates,
    });
  },
  /* ALL PROPERTIES */
  properties: async (req, res) => {
    await handleUpdateStatistics();
    const properties = await Property.find()
      .populate("neighbors")
      .limit(10)
      .sort([["created_on", -1]]);
    let activeProperties = [];
    properties.forEach((pro, i) => {
      if (pro.active === true) {
        activeProperties.push(pro);
      }
    });

    let total = activeProperties.length;

    res.render("client/properties", {
      properties: activeProperties,
      totalPropierties: total,
      filters: "",
      showMore: true,
    });
  },
  /* ALL PROPERTIES-RAW */
  propertiesRawData: async (req, res) => {
    const properties = await Property.find();
    let activeProperties = [];
    properties.forEach((pro, i) => {
      if (pro.active === true) {
        activeProperties.push({
          id: pro.id,
          name: pro.name,
          primary_img: pro.primary_img,
          code: pro.code,
        });
      }
    });

    res.status(200).json(activeProperties);
  },
  /* ALL NEWSLETTER */
  newsletter: async (req, res) => {
    await handleUpdateStatistics();
    const newsletters = await Newsletter.find()
      .skip(0)
      .sort([["created_on", -1]]);

    let activeNews = [];
    newsletters.forEach((post) => {
      if (post.is_active === true) {
        activeNews.push(post);
      }
    });

    let total = activeNews.length;

    res.render("client/newsletter", {
      newsletters: activeNews,
      totalNews: total,
    });
  },
  /* ONE NEWSLETTER */
  newsletterOne: async (req, res) => {
    const id = req.params.id;
    await handleUpdateStatistics(id, "newsletter");
    const newsletter = await Newsletter.findById(id);
    res.render("client/newsletterOne", { newsletter: newsletter });
  },
  /* ASESORY */
  asesory: async (req, res) => {
    await handleUpdateStatistics();
    res.render("client/asesory");
  },
  /* ABOUT US */
  aboutUs: async (req, res) => {
    await handleUpdateStatistics();
    res.render("client/about");
  },
  /* CONTACT FORM */
  getEmailContact: async (req, res) => {
    // console.log(req.body);
  },
  /* GET MORE PROPERTIES */
  getMoreProperties: async (req, res) => {
    const form = new formidable.IncomingForm();
    let activeProperties = [];
    let moreProperties = false;
    let idsToSkipClient = [];
    let propertiesForFront = [];

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      skip = parseInt(fields.skip);

      idsToSkip = fields.idsToSkip.split(",");

      const properties = await Property.find()
        .populate("neighbors")
        .skip(skip)
        .sort([["created_on", -1]]);

      properties.forEach((pro) => {
        if (pro.active === true) {
          activeProperties.push(pro);
        }
      });

      idsToSkip.forEach((idSkip) => {
        activeProperties.forEach((pro, i) => {
          if (idSkip === pro.id) {
            activeProperties.splice(i, 1);
          }
        });
      });

      activeProperties.forEach((pro, i) => {
        if (i < 10) {
          idsToSkipClient.push(pro.id);
          propertiesForFront.push(pro);
        }
        if (activeProperties.length > 10) {
          moreProperties = true;
        }
      });

      res.status(200).send({
        properties: propertiesForFront,
        moreProperties,
        idsToSkipClient,
      });
    });
  },
  /* GET MORE PROPERTIES HOME VIEW */
  getMorePropertiesForHome: async (req, res) => {
    const form = new formidable.IncomingForm();
    let highlightProperties = [];
    let moreProperties = false;
    let idsToSkipClient = [];
    let propertiesForHome = [];

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      skip = parseInt(fields.skip);
      idsToSkip = fields.idsToSkip.split(",");

      const properties = await Property.find()
        .populate("neighbors")
        .sort([["created_on", -1]]);

      properties.forEach((pro, i) => {
        if (pro.active === true && pro.highlight === true) {
          highlightProperties.push(pro);
        }
      });

      // highlightProperties = highlightProperties.splice(4, skip)

      highlightProperties.forEach((pro, i) => {
        if (!idsToSkip.includes(pro.id)) {
          propertiesForHome.push(pro);
          idsToSkipClient.push(pro.id);
        }
      });

      if (highlightProperties.length > propertiesForHome.length) {
        moreProperties = true;
      }

      const ids = idsToSkip + idsToSkipClient;

      res.status(200).send({
        properties: propertiesForHome,
        moreProperties,
        idsToSkip: ids,
      });
    });
  },
  /* GET MORE POST (NEWSLETTER) */
  getMoreNewsletters: async (req, res) => {
    const form = new formidable.IncomingForm();
    let activeNews = [];
    let moreNews = false;
    let idsToSkipClient = [];
    let newsForNewsletter = [];

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      skip = parseInt(fields.skip);

      idsToSkip = fields.idsToSkip.split(",");

      const news = await Newsletter.find()
        .skip(skip)
        .sort([["created_on", -1]]);

      news.forEach((post, i) => {
        if (post.is_active === true && i <= 5) {
          activeNews.push(post);
        }
      });

      activeNews.forEach((post, i) => {
        idsToSkipClient.push(post.id);
        newsForNewsletter.push(post);
      });
      if (news.length > newsForNewsletter.length) {
        moreNews = true;
      }

      const ids = idsToSkip + idsToSkipClient;

      res.status(200).send({ news: activeNews, moreNews: moreNews, ids });
    });
  },
  /* ACTION SEARCH PROPIERTIES */
  searchProperties: async (req, res) => {
    data = req.params.data;
    dataArray = data.split("&");

    const sell_or_rent = dataArray[0].split("=")[1];
    const cost = dataArray[1].split("=")[1];
    const cost_low = cost.split("-")[0];
    const cost_top = cost.split("-")[1];
    const typesArray = dataArray[2].split(",");
    const types = [];
    const departmentsArray = dataArray[3].split(",");
    const departments = [];
    let total;
    let activeProperties = [];
    let activeProperties2 = [];

    typesArray.forEach((el) => {
      let type = el.replace("type=", "");
      if (type !== "") types.push(type);
    });

    departmentsArray.forEach((el) => {
      let department = el.replace("department=", "");
      if (department !== "") departments.push(department);
    });

    const filter1 = { sell_or_rent: { $eq: sell_or_rent } };

    let propsForSellRent = await Property.aggregate([{ $match: filter1 }]);
    const propsForPrice = [];
    const propsForType = [];
    const propsForDeparment = [];

    if (cost !== "undefined") {
      propsForSellRent.forEach((prop) => {
        let price = Number(prop.price) * 1000;
        const filterPriceDown = Number(cost_low) * 1000;
        const filterPriceTop = Number(cost_top) * 1000;
        if (price >= filterPriceDown && price <= filterPriceTop) {
          propsForPrice.push(prop);
        }
      });
      propsForPrice.forEach((pro, i) => {
        if (pro.active === true) {
          activeProperties.push(pro);
        }
      });
      total = propsForPrice.length;
    }
    if (cost !== "undefined" && types.length > 0) {
      propsForPrice.forEach((prop) => {
        types.forEach((type) => {
          type === prop.type ? propsForType.push(prop) : "";
        });
      });
      propsForType.forEach((pro, i) => {
        if (pro.active === true) {
          activeProperties.push(pro);
        }
      });
      total = propsForType.length;
    }
    if (cost === "undefined" && types.length > 0) {
      propsForSellRent.forEach((prop) => {
        types.forEach((type) => {
          type === prop.type ? propsForType.push(prop) : "";
        });
      });
      propsForType.forEach((pro, i) => {
        if (pro.active === true) {
          activeProperties.push(pro);
        }
      });
      total = propsForType.length;
    }
    if (cost === "undefined" && types.length <= 0) {
      propsForSellRent.forEach((pro, i) => {
        if (pro.active === true) {
          activeProperties.push(pro);
        }
      });
      total = propsForSellRent.length;
    }
    if (departments.length > 0) {
      activeProperties.forEach((prop) => {
        departments.forEach((department) => {
          department === prop.department ? activeProperties2.push(prop) : "";
        });
      });
      total = activeProperties2.length;
    }

    /* res
      .status(200)
      .send({ properties: activeProperties, totalPropierties: total }); */

    const filters = `${sell_or_rent},${cost},${types},${departments}`;
    let deleteDuplicates;

    if (activeProperties2.length > 0 || departments.length > 0) {
      deleteDuplicates = activeProperties2.filter((prop, i) => {
        return activeProperties2.indexOf(prop) === i;
      });
    } else {
      deleteDuplicates = activeProperties.filter((prop, i) => {
        return activeProperties.indexOf(prop) === i;
      });
    }

    res.render("client/properties", {
      properties: deleteDuplicates,
      totalPropierties: total,
      filters: filters,
      showMore: false,
    });
  },
  /* ACTION SUBSCRIBE TO NEWSLETTER */
  subscribe: async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      // console.log(fields);

      email = fields.email;

      const subscription = await addSubscriber(email, {}, true);

      // console.log(subscription.m.statusCode);
      if (subscription.m.statusCode === 200) {
        res.status(200).json({ status: "ok" });
      }
    });
  },
};

module.exports = clientController;
