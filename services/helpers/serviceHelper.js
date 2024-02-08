const fs = require("fs");
const path = require("path");

const pathRouter = path.join(__dirname, "../..", "models");

class ServiceHelper {
  _model = null;
  _action = null;
  _data = null;
  _idSelected = null;

  constructor(model) {
    if (!model) {
      throw new Error("ServiceHelper class has missed model");
    }
    this._model = model;
  }

  async executeAction(action, data, id) {
    let fileNameSelected = "";

    fs.readdirSync(pathRouter).filter((file) => {
      const cleanName = cleanFileName(file);
      if (this._model === cleanName) {
        fileNameSelected = cleanName;
        return fileNameSelected;
      }
    });

    const model = require(`${pathRouter}/${fileNameSelected}`);

    switch (action) {
      case "get":
        return await model.find();
      case "post":
        return await model.create(data);
      case "getById":
        return await model.findById(id);
      case "updateById":
        const selectedItem = await model.findById(id);

        const itemProps = new Set(Object.keys(model.schema.tree));


        for (const prop in data) {
          if (itemProps.has(prop)) {
            // console.log(`${prop}-DB:`, selectedItem[prop]);
            selectedItem[prop] = data[prop];
            await selectedItem.save();
          }
        }
        break;
      case "delete":
        console.log("delete");
        break;
      default:
        return false;
    }
  }
}

module.exports = ServiceHelper;

const cleanFileName = (fileName) => {
  const file = fileName.split(".").shift().toLowerCase();
  return file;
};
