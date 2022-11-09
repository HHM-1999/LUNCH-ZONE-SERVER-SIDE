const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



//middleware

app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9k4z9b7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
    try {
        const serviceCollection = client.db('lunchzone').collection('services');
        const reviewCollection = client.db('lunchzone').collection('review');


        ///all services page service get
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

        })


        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const service = await cursor.limit(3).toArray();
            res.send(service);

        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service)

        })

        app.post('/reviews', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result);

        })
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        })

    }
    finally {

    }
}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send("hello");
})

app.listen(port, () => {
    console.log(`listening port ${port}`);
})