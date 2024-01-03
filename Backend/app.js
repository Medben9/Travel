const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;

// Enable CORS
const corsOptions = {
  origin: 'http://localhost:3000',  // Replace with your React app's actual origin
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
dotenv.config();

const uri = process.env.MONGO_URI;

// Create a MongoDB client with connection pooling options
const client = new MongoClient(uri);

// Use connection pooling by maintaining a single connection pool across requests
let databaseClient;

const connectToDatabase = async () => {
  try {
    if (!databaseClient) {
      // If the client is not yet connected, establish a connection
      databaseClient = await client.connect();
    }
    return databaseClient.db('Booking');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

// Middleware for parsing JSON requests
app.use(express.json());

// Hello World route
app.get('/', (req, res) => {
  res.send('Hello World!');
});






//-------------------GET-FLIGHTS-------------------//
//-------------------GET-------------------//


// Flights routes
app.get('/flights', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('flights');
    const flights = await collection.find({
      'Departure': req.query.departure,
      'Arrival': req.query.arrival
    }).toArray();
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get only flights departures!
app.get('/departures', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('flights');

    const uniqueDepartures = await collection.distinct('Departure');

    if (!uniqueDepartures || uniqueDepartures.length === 0) {
      return res.status(404).json({ message: 'Departures not found' });
    }

    res.json(uniqueDepartures);
  } catch (error) {
    console.error('Error fetching departures:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get only flights arrivals!
app.get('/arrivals', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('flights');

    const uniqueArrivals = await collection.distinct('Arrival');

    if (!uniqueArrivals || uniqueArrivals.length === 0) {
      return res.status(404).json({ message: 'Arrivals not found' });
    }

    res.json(uniqueArrivals);
  } catch (error) {
    console.error('Error fetching arrivals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//Get all flights arrivals from a flight !
app.get('/flight/:arrival', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('flights');

    const flights = await collection.find({ 'Arrival': req.params.arrival }).toArray();

    if (!flights || flights.length === 0) {
      return res.status(404).json({ message: 'Flights not found for the given arrival' });
    }

    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get all flights departure from a flight !
app.get('/fl/:departure', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('flights');

    const flights = await collection.find({ 'Departure': req.params.departure }).toArray();

    if (!flights || flights.length === 0) {
      return res.status(404).json({ message: 'Flights not found for the given departure' });
    }

    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get Location Value from a flight !

app.get('/flights/:Location', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('flights');

    const locationType = req.params.Location.split('-')[0];
    const locationValue = req.params.Location.split('-')[1];

    let query = {};
    if (locationType === 'Departure') {
      query = { 'Departure': locationValue };
    } else if (locationType === 'Arrival') {
      query = { 'Arrival': locationValue };
    }

    const flights = await collection.find(query).toArray();

    if (!flights || flights.length === 0) {
      return res.status(404).json({ message: `Flights not found for the selected ${locationType}: ${locationValue}` });
    }

    res.json(flights);
  } catch (error) {
    console.error(`Error fetching flights for location ${req.params.Location}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




//flights by id 
app.get('/flig/:ID', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('flights');
    const flight = await collection.findOne({ 'ID': parseInt(req.params.ID, 10) });
    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.delete('/delete/:collection/:ID', async (req, res) => {
  const { collection, ID } = req.params;

  try {
    const database = await connectToDatabase();
    const targetCollection = database.collection(collection);
    const result = await targetCollection.deleteOne({ ID: parseInt(ID, 10) });

    res.json({ success: true, message: `Deleted ${result.deletedCount} entry(s)` });
  } catch (error) {
    console.error('Error deleting:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});






//-------------------ENDGET-------------------//





//-------------------GET-PASSENGERS-------------------//
//-------------------GET-------------------//




// Passengers routes
app.get('/passeng', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('passengers');
    const passengers = await collection.find().toArray();
    res.json(passengers);
  } catch (error) {
    console.error('Error fetching passengers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Check passenger availability based on name and email
app.get('/passengers', async (req, res) => {
  const { Name, Email } = req.query;

  try {
    const database = await connectToDatabase();
    const collection = database.collection('passengers');
    
    // Use case-insensitive search by converting Name and Email to lowercase
    const passenger = await collection.findOne(
      { Name: { $regex: new RegExp(`^${Name}$`, 'i') }, Email: { $regex: new RegExp(`^${Email}$`, 'i') } },
      { projection: { _id: 0 } }
    );

    if (passenger !== null) {
      res.json({ success: true, passenger });
    } else {
      res.json({ success: false, message: 'Passenger not found' });
    }
  } catch (error) {
    console.error('Error checking passenger:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


//passenger by id
app.get('/passenger/:ID', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('passengers');
    const passenger = await collection.findOne({ 'ID': parseInt(req.params.ID, 10) });
    res.json(passenger);
  } catch (error) {
    console.error('Error fetching passenger:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  finally {
    (console.log('Connection closed !'));
  }
gi});


// Create a new passenger or passengers
const uuid = require('uuid');

app.post('/add-passengers', async (req, res) => {
    console.log('Received data:', req.body); // Log received data
    try {
        const database = await connectToDatabase();
        const collection = database.collection('passengers');

        let passengers = req.body;

        // If req.body is not an array, convert it to an array
        if (!Array.isArray(passengers)) {
            passengers = [passengers];
        }

        // Ensure each passenger has the required fields and assign a unique ID
        const newPassengers = passengers.map(passenger => {
            const { name, email } = passenger;

            // Check if required fields are present
            if (!name || !email) {
                throw new Error('Name and Email are required fields for each passenger.');
            }

            return { id: uuid.v4(), Name: name, Email: email };
        });

        const result = await collection.insertMany(newPassengers);

        // Assuming result.ops contains the inserted documents
        const insertedData = result.ops;

        res.json({
            success: true,
            message: 'Passengers created successfully',
            data: insertedData,
        });
    } catch (error) {
        console.error('Error creating passengers:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});




//-------------------ENDGET-------------------//

//-------------------GET-RESERVATIONS-------------------//
//-------------------GET-------------------//


// Reservations routes
app.get('/reservations', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('reservations');
    const reservations = await collection.find().toArray();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//reservation by id 
app.get('/reservations/:ID', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('reservations');
    
    // Assuming "ID" is the field you want to use for lookup within the nested structure
    const reservation = await collection.findOne({ 'ID': parseInt(req.params.ID, 10) });
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    } else {
      res.json(reservation);
    }
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// //-------------------POST-------------------//
//-------------------POST-------------------//


// Create a new reservation
app.post('/add-reservation', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('reservations');

    const reservationData = req.body;

    // Structure the reservation data
    const newReservation = {
      TravelID: reservationData.flightDetails.ID,
      Departure: reservationData.flightDetails.Departure,
      Arrival: reservationData.flightDetails.Arrival,
      Price: reservationData.flightDetails.Price,
      Duration: reservationData.flightDetails.Duration,
      PassengerName: reservationData.name,
      PassengerEmail: reservationData.email,
      // Add any other relevant reservation data
    };

    const insertedData = await collection.insertOne(newReservation);
    res.json({
      message: 'Reservation created successfully',
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





// Create a new flight or flights
app.post('/add-flights', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('flights');

    let flights = req.body;

    // If req.body is not an array, convert it to an array
    if (!Array.isArray(flights)) {
      flights = [flights];
    }

    // Ajout d'un tableau pour gérer la structure des données
    const newFlights = flights.map(flight => ({
      ID: flight.ID,
      Departure: flight.Departure,
      Arrival: flight.Arrival,
      Airline : flight.Airline,
    }));

    const result = await collection.insertMany(newFlights);

    // Assuming result.ops contains the inserted documents
    const insertedData = result.ops;

    res.json({
      message: 'Flights created successfully',
      data: insertedData,
    });
  } catch (error) {
    console.error('Error creating flights:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



//-------------------ENDPOST-------------------//
//-------------------ENDPOST-------------------//



//------------AGGREGATION------------------//



app.get('/aggregateReservations', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('reservations');

    // Example aggregation pipeline to group reservations by TravelID and count them
    const aggregationPipeline = [
      {
        $group: {
          _id: '$TravelID',
          totalReservations: { $sum: 1 },
        },
      },
      {
        $sort: { totalReservations: -1 },
      },
    ];

    const aggregatedResults = await collection.aggregate(aggregationPipeline).toArray();
    res.json(aggregatedResults);
  } catch (error) {
    console.error('Error performing aggregation on reservations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});






app.get('/averageTicketPriceByDestination', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const reservationsCollection = database.collection('reservations');
    const flightsCollection = database.collection('flights');

    const averageTicketPriceByDestinationPipeline = [
      {
        $lookup: {
          from: 'flights',
          localField: 'TravelID',
          foreignField: 'ID',
          as: 'flightDetails',
        },
      },
      {
        $unwind: '$flightDetails',
      },
      {
        $group: {
          _id: '$flightDetails.Arrival',
          averageTicketPrice: { $avg: '$flightDetails.Price' },
        },
      },
    ];

    const result = await reservationsCollection.aggregate(averageTicketPriceByDestinationPipeline).toArray();

    res.json(result);
  } catch (error) {
    console.error('Error performing aggregation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add the following endpoint to your Express app

// Add this route for fetching busiest travel routes
app.get('/busiest-routes', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const reservationsCollection = database.collection('reservations');

    const busiestRoutesPipeline = [
      {
        $lookup: {
          from: 'flights',
          localField: 'TravelID',
          foreignField: 'ID',
          as: 'flightDetails',
        },
      },
      {
        $unwind: '$flightDetails',
      },
      {
        $group: {
          _id: {
            departure: '$flightDetails.Departure',
            arrival: '$flightDetails.Arrival',
          },
          routeCount: { $sum: 1 },
        },
      },
    ];

    const busiestRoutes = await reservationsCollection
      .aggregate(busiestRoutesPipeline)
      .toArray();

    res.json(busiestRoutes);
  } catch (error) {
    console.error('Error fetching busiest routes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Add this route for fetching total reservations by passenger
// Add this route for fetching total revenue by travel agency
app.get('/total-revenue-by-travel-agency', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const reservationsCollection = database.collection('reservations');

    const totalRevenueByTravelAgencyPipeline = [
      {
        $lookup: {
          from: 'flights', // Replace with the actual name of your flights collection
          localField: 'TravelID',
          foreignField: 'ID',
          as: 'flightDetails',
        },
      },
      {
        $unwind: '$flightDetails',
      },
      {
        $group: {
          _id: '$flightDetails.Airline',
          totalRevenue: { $sum: '$flightDetails.Price' },
        },
      },
      {
        $project: {
          _id: 0,
          TravelAgency: '$_id',
          TotalRevenue: '$totalRevenue',
        },
      },
    ];

    const totalRevenueByTravelAgency = await reservationsCollection
      .aggregate(totalRevenueByTravelAgencyPipeline)
      .toArray();

    res.json(totalRevenueByTravelAgency);
  } catch (error) {
    console.error('Error fetching total revenue by travel agency:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Add this route for fetching most popular destinations
app.get('/most-popular-destinations', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const reservationsCollection = database.collection('reservations');

    const mostPopularDestinationsPipeline = [
      {
        $lookup: {
          from: 'flights', // Replace with the actual name of your flights collection
          localField: 'TravelID',
          foreignField: 'ID',
          as: 'flightDetails',
        },
      },
      {
        $unwind: '$flightDetails',
      },
      {
        $group: {
          _id: '$flightDetails.Arrival',
          destinationCount: { $sum: 1 },
        },
      },
      {
        $sort: { destinationCount: -1 },
      },
      {
        $limit: 5, // Change this value based on how many popular destinations you want to retrieve
      },
      {
        $project: {
          _id: 0,
          Destination: '$_id',
          DestinationCount: '$destinationCount',
        },
      },
    ];

    const mostPopularDestinations = await reservationsCollection
      .aggregate(mostPopularDestinationsPipeline)
      .toArray();

    res.json(mostPopularDestinations);
  } catch (error) {
    console.error('Error fetching most popular destinations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
