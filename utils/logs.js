const fs = require("fs");

const logFolderPath = "../logs";

if (!fs.existsSync(logFolderPath)) {
  fs.mkdirSync(logFolderPath);
}

const logToFile = (message) => {
  const date = new Date();
  const filename = `${logFolderPath}/${date
    .toISOString()
    .replace(/:/g, "-")}.txt`;

  fs.appendFile(filename, message + "\n", (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
};

module.exports = logToFile;
