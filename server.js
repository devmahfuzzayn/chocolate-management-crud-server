const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Chocolate Management CRUD Server is Running!!!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wfuffuf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();

        const chocolatesCollection = client
            .db("chocolatesDB")
            .collection("chocolates");

        app.get("/chocolates", async (req, res) => {
            const result = await chocolatesCollection.find().toArray();
            res.send(result);
        });

        app.get("/chocolates/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await chocolatesCollection.findOne(query);
            res.send(result);
        });

        app.post("/addChocolate", async (req, res) => {
            const chocolate = req.body;
            const result = await chocolatesCollection.insertOne(chocolate);
            res.send(result);
        });

        app.delete("/chocolates/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await chocolatesCollection.deleteOne(query);
            res.send(result);
        });

        app.put("/chocolates/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedChocolate = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const chocolateDoc = {
                $set: {
                    name: updatedChocolate.name,
                    country: updatedChocolate.country,
                    category: updatedChocolate.category,
                },
            };
            const result = await chocolatesCollection.updateOne(
                filter,
                chocolateDoc,
                options
            );
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Finally code goes here...
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Chocolate Management Server is Running on Port: ${port}`);
});
