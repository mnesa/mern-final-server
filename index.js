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
      const date = req.query.date;
      console.log(date);
      const query = {};
      const options = await appointmentOptionCollection.find(query).toArray();

      const bookingQuery = { appointmentDate:date }
      const alreadyBooked = await bookingCollection.find(bookingQuery).toArray();
      // console.log(alreadyBooking);

      options.forEach(option => {
        const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
        const bookedSlots = optionBooked.map(book => book.slot);
        console.log(bookedSlots);
        const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot));
        option.slots = remainingSlots;
      })

      res.send(options)
})

    app.post('/bookings', async (req, res) => {
      const bookings = req.body;
      const query = {
        appointmentDate: bookings.appointmentDate,
        email: bookings.email,
        treatment: bookings.treatment
      }
      const alreadyBooked = await bookingCollection.find(query).toArray();
      if (alreadyBooked.length) {
        const message = `You have a booking on ${bookings.appointmentDate}. You can try another day. `
        return res.send({acknowledged: false, message})
      }
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