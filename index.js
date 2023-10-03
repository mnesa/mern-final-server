const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0shop52.knssrag.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db('mern-Final-proj23');
    const appointmentOptionCollection = database.collection('AppointmentOptions');
    const bookingCollection = database.collection('Bookings')

    app.get('/appointmentOptions', async (req, res) => {
      const query = {};
      const result = await appointmentOptionCollection.find(query).toArray();
      res.send(result)
})

    app.post('/bookings', async (req, res) => {
      const bookings = req.body;
      console.log(bookings);
      const result = await bookingCollection.insertOne(bookings);
      res.send(result)
    })

  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Doctor Portal is!')
})

app.listen(port, () => {
  console.log(`Our Doctor Portal run on port ${port}`)
})