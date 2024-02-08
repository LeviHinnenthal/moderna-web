const mongoose = require('mongoose');
const fs = require('fs');

const { MONGO_DB_URI } = process.env;

const logFolderPath = './logs';

if (!fs.existsSync(logFolderPath)) {
  fs.mkdirSync(logFolderPath);
}

const logToFile = (message) => {
  const date = new Date();
  const filename = `${logFolderPath}/${date.toISOString().replace(/:/g, '-')}.txt`;

  fs.appendFile(filename, message + '\n', (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

const connectToDatabase = () => {
  mongoose
    .connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      bufferMaxEntries: 0,
      serverSelectionTimeoutMS: 120000,
    })
    .then(() => {
      const message = "Database connected";
      console.log(message);
      // logToFile(message);
    })
    .catch((error) => {
      const errorMessage = "Connection error: " + error;
      console.error(errorMessage);
      logToFile(errorMessage);
    });

  mongoose.connection.on("disconnected", () => {
    const message = "Database disconnected";
    console.error(message);
    // logToFile(message);
    connectToDatabase(); // Reintentar la conexión
  });
};

connectToDatabase();

process.on("uncaughtException", (error) => {
  const errorMessage = "Uncaught exception: " + error;
  console.error(errorMessage);
  logToFile(errorMessage);
  mongoose.disconnect();
});
