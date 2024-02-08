const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const path = require("path");

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const storage = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

/* const getBuckets = () => {
    return storage.listBuckets().promise();
}; */

const uploadToBucket = (bucketName, file) => {
  const stream = fs.createReadStream(file.filepath);
  const params = {
    Bucket: bucketName,
    Key: file.newFilename,
    Body: stream,
  };
  return storage.upload(params).promise();
};

const deleteFromBucket = (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };
  return storage.deleteObject(params).promise();
};

async function readAndDeleteTemp() {
  fs.readdir("./tmp/", function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files.forEach(async function (file) {
      try {
        var imgExt = new RegExp(/(png|jpg|jpeg|tiff|jfif|webp)/g);

        if (imgExt.test(path.extname(file))) fs.unlinkSync("./tmp/" + file);
        //file removed
      } catch (err) {
        console.error(err);
      }
    });
  });
  return true;
}

module.exports = {
  uploadToBucket,
  deleteFromBucket,
  readAndDeleteTemp,
};
