const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

// midelware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("best hotel is open");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@best-hotel.j9axx.mongodb.net/?retryWrites=true&w=majority&appName=best-hotel`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //  database collection
    const rommCollection = client.db("opal-blosomDb").collection("roomsDB");

    // room api
    app.get("/allroom", async (req, res) => {
      const coursor = rommCollection.find();
      const result = await coursor.toArray();
      res.send(result);
    });

    // room details api
    app.get("/roomdetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          title: 1,
          image: 1,
          description: 1,
          price: 1,
          offers: 1,
          room_size: 1,
        },
      };
      const result = await rommCollection.findOne(query, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Best hotel is open on port ${port}`);
});
