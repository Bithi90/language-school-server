const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware 
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
} 

app.use(cors(corsOptions));
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avf7i9k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const instructorCollection = client.db("languageDB").collection("instructor");
        const userCollection = client.db("languageDB").collection("user");
        const cartCollection = client.db("languageDB").collection("cart");
        const courseCollection = client.db("languageDB").collection("course");
        const pendingclassCollection = client.db("languageDB").collection("pendingClass");

        app.post('/course', async (req, res) => {
            const item = req.body;
            console.log({item});
            const result = await courseCollection.insertOne(item);
            res.send(result);
        })

        app.delete('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await courseCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/pendingClass', async (req, res) => {
            const item = req.body;
            console.log({item});
            const result = await pendingclassCollection.insertOne(item);
            res.send(result);
        })

        app.get('/pendingClass',async (req, res) => {
            const result = await pendingclassCollection.find().toArray();
            res.send(result);
        })

        app.patch('/pendingClass/approved/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: 'approved'
                },
            };
            const result = await pendingclassCollection.updateOne(filter, updateDoc);
            res.send(result);
        }) 

         app.delete('/pendingClass/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await pendingclassCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/instructor', async (req, res) => {
            const result = await instructorCollection.find().toArray();
            res.send(result);
        })

         app.get('/user/instructor/:email',  async (req, res) => {
            const email = req.params.email;

            if (req.decoded.email !== email) {
                res.send({ instructor: false })
            }

            const query = { email: email }
            const user = await userCollection.findOne(query);
            const result = { instructor: user?.role === 'instructor' }
            res.send(result);
        })
         app.patch('/user/instructor/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'instructor'
                },
            };     
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

         app.patch('/user/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

         app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;

            if (req.decoded.email !== email) {
                res.send({ admin: false })
            }

            const query = { email: email }
            const user = await userCollection.findOne(query);
            const result = { admin: user?.role === 'admin' }
            res.send(result);
        })
 
        app.get('/course', async (req, res) => {
            const result = await courseCollection.find().toArray();
            res.send(result);
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/user', async(req , res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.get('/user', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        // cart collection

        app.post('/cart', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
            res.send(result);
        })
        app.get('/cart', async (req ,res ) =>{
            const email = req.query.email;

            if(!email){
                res.send([]);
            }
            const query = {email: email};
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('student is running')
})

app.listen(port, () => {
    console.log(`school server is running on port ${port}`);
})  