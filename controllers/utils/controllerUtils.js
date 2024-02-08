const Newsletter = require("../../models/Newsletter");
const Property = require("../../models/Property");
const App = require("../../models/App");

const handleUpdateStatistics = async (itemId, dbModel) => {
  const date = new Date();
  const getTotalStatistics = await App.find();

  if (getTotalStatistics.length <= 0) {
    // New Record
    const newRecord = new App();
    newRecord.save();
  } else {
    const lastRec = getTotalStatistics[getTotalStatistics.length - 1];
    const lastRecMonth = new Date(lastRec.update_on).getMonth();
    const lastRecDay = new Date(lastRec.update_on).getUTCDate();
    const todayDate = new Date();
    const todayDay = new Date().getUTCDate();
    const thisMonth = todayDate.getMonth();
    const updateViewsThisMonth = lastRec.views_this_month + 1;
    if (lastRecMonth === thisMonth) {
      // Gral Records
      // Update record
      const data = {
        views_this_month: updateViewsThisMonth,
        update_on: todayDate,
      };

      // console.log("aca", lastRec);
      // Views per day
      if (lastRecDay === todayDay) {
        data.total_views_today = lastRec.total_views_today + 1;
      } else {
        data.total_views_today = 1;
      }

      // Views on specific item
      if (itemId && dbModel) {
        if (dbModel === "property") {
          data.views_this_month_properties =
            lastRec.views_this_month_properties + 1;

          const propertySelected = await Property.findById(itemId);

          if (propertySelected.times_visited !== null) {
            propertySelected.times_visited = propertySelected.times_visited + 1;
          } else {
            propertySelected.times_visited = 1;
          }
          propertySelected.save();
        }
        if (dbModel === "newsletter") {
          data.views_this_month_newsletter =
            lastRec.views_this_month_newsletter + 1;

          const newsletterSelected = await Newsletter.findById(itemId);

          if (newsletterSelected.times_visited !== null) {
            newsletterSelected.times_visited =
              newsletterSelected.times_visited + 1;
          } else {
            newsletterSelected.times_visited = 1;
          }

          newsletterSelected.save();
        }
      }

      await App.findOneAndUpdate({ _id: lastRec._id }, data);
    } else {
      // New Record
      const newRecord = new App();
      newRecord.save();
    }
  }

  return null;
};

const handleGetStatistics = async () => {
  const getTotalStatistics = await App.find();
  const lastRec = getTotalStatistics[getTotalStatistics.length - 1];

  return { getTotalStatistics, lastRec };
};

module.exports = {
  handleUpdateStatistics,
  handleGetStatistics,
};
