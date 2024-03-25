const { MongoClient, ObjectId } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://root:root@cluster0.o05wx.mongodb.net/myFirstDatabase";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("myFirstDatabase");
    const collection = database.collection("properties");

    const result = await collection.updateMany({}, [
      {
        $set: {
          images: {
            $map: {
              input: "$images",
              as: "img",
              in: {
                $cond: {
                  if: {
                    $eq: [{ $type: "$$img" }, "string"],
                  },
                  then: {
                    $replaceAll: {
                      input: "$$img",
                      find: "storage",
                      replacement: "bucket",
                    },
                  },
                  else: "$$img",
                },
              },
            },
          },
          attractions_images: {
            $map: {
              input: "$attractions_images",
              as: "img",
              in: {
                $cond: {
                  if: {
                    $eq: [{ $type: "$$img" }, "string"],
                  },
                  then: {
                    $replaceAll: {
                      input: "$$img",
                      find: "storage",
                      replacement: "bucket",
                    },
                  },
                  else: "$$img",
                },
              },
            },
          },
          primary_img: {
            $cond: {
              if: {
                $eq: [{ $type: "$primary_img" }, "string"],
              },
              then: {
                $replaceAll: {
                  input: "$primary_img",
                  find: "storage",
                  replacement: "bucket",
                },
              },
              else: "$primary_img",
            },
          },
          secondary_img: {
            $cond: {
              if: {
                $eq: [{ $type: "$secondary_img" }, "string"],
              },
              then: {
                $replaceAll: {
                  input: "$secondary_img",
                  find: "storage",
                  replacement: "bucket",
                },
              },
              else: "$secondary_img",
            },
          },
        },
      },
    ]);

    console.log("Number of documents updated: " + result.modifiedCount);
  } finally {
    // Ensure that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
