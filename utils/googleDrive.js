const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectURL = process.env.GOOGLE_REDIRECT_URL;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectURL
);

oauth2Client.setCredentials({
  access_token: accessToken,
  refresh_token: refreshToken,
});

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

async function createFolder(folderName, folderParent) {
  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: [folderParent],
  };
  const folderCreate = await drive.files.create({
    resource: fileMetadata,
    field: "id",
  });
  const folderId = await folderCreate.data.id;
  //   console.log(folderCreate)

  return folderId;
}

async function uploadFile(fileName, propertyFolderId) {
  try {
    const res = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: "image/jpg",
        parents: [propertyFolderId],
      },
      media: {
        mimeType: "image/jpg",
        body: fs.createReadStream("./uploads/" + fileName),
      },
    });
    await drive.permissions.create({
      fileId: res.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return res.data.id;
  } catch (err) {
    // console.log(err);
    return false;
  }
}

async function readAndDeleteTemp() {
  fs.readdir("./uploads/", function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files.forEach(async function (file) {
      try {
        var imgExt = new RegExp(/(png|jpg|jpeg|tiff|jfif|webp)/g);

        if (imgExt.test(path.extname(file))) fs.unlinkSync("./uploads/" + file);
        //file removed
      } catch (err) {
        console.error(err);
      }
    });
  });
  return true;
}

async function generatePublicURL(id) {
  try {
    const fileId = id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const results = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    const fileLink = results.data;

    return fileLink;
  } catch (err) {
    // console.log(err.message);
    return false;
  }
}

async function deleteFileFolder(fileId, parentId) {
  try {
    const res = await drive.files.delete({
      fileId: fileId,
      q: `'${parentId}' in parents and trashed=false`,
    });

    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // console.log(error.message);
    return false;
  }
}

module.exports = {
  uploadFile,
  createFolder,
  readAndDeleteTemp,
  generatePublicURL,
  deleteFile: deleteFileFolder,
};
