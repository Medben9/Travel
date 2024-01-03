//import the react router dom to redirect user to other pages
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Container,
} from '@mui/material';
import Navbar from '../Components/Navbar';
const Home = () => {
  const [departures, setDepartures] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState('');
  const [selectedArrival, setSelectedArrival] = useState('');
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    // Fetch departures
    fetch('http://localhost:3030/departures')
      .then(response => response.json())
      .then(data => setDepartures(data))
      .catch(error => console.error('Error fetching departures:', error));

    // Fetch arrivals
    fetch('http://localhost:3030/arrivals')
      .then(response => response.json())
      .then(data => setArrivals(data))
      .catch(error => console.error('Error fetching arrivals:', error));
  }, []);

  const handleDepartureChange = event => {
    const newSelectedDeparture = event.target.value;
    setSelectedDeparture(newSelectedDeparture);
  };

  const handleArrivalChange = event => {
    const newSelectedArrival = event.target.value;
    setSelectedArrival(newSelectedArrival);
  };

  const handleFetchFlights = () => {
    // Fetch flights based on the selected departure and arrival
    if (selectedDeparture && selectedArrival) {
      fetch(`http://localhost:3030/flights?departure=${selectedDeparture}&arrival=${selectedArrival}`)
        .then(response => response.json())
        .then(data => setFlights(data))
        .catch(error => console.error(`Error fetching flights for departure ${selectedDeparture} and arrival ${selectedArrival}:`, error));
    }
  };


  const handleBookFlight = (flightId) => {
    // Redirect the user to the Book Flight page
    navigate(`/Book/${flightId}`);
  };


  return (
    <div>
        
      <Navbar/>

      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        {/* Departures Dropdown */}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="departure-select">Select a departure:</InputLabel>
          <Select
            label="Select a departure"
            value={selectedDeparture}
            onChange={handleDepartureChange}
            inputProps={{
              name: 'departure',
              id: 'departure-select',
            }}
          >
            <MenuItem value="">All Departures</MenuItem>
            {departures.map((departure) => (
              <MenuItem key={departure} value={departure}>
                {departure}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Arrivals Dropdown */}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="arrival-select">Select an arrival:</InputLabel>
          <Select
            label="Select an arrival"
            value={selectedArrival}
            onChange={handleArrivalChange}
            inputProps={{
              name: 'arrival',
              id: 'arrival-select',
            }}
          >
            <MenuItem value="">All Arrivals</MenuItem>
            {arrivals.map((arrival) => (
              <MenuItem key={arrival} value={arrival}>
                {arrival}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Fetch Flights Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleFetchFlights}
          style={{ margin: '16px 0' }}
        >
          Fetch Flights
        </Button>

        {/* Flights */}
        <Typography variant="h2" align="center" gutterBottom>
          Flights
        </Typography>
        {Array.isArray(flights) && flights.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {flights.map((flight) => (
              <li key={flight.ID} style={{ borderBottom: '1px solid #ccc', padding: '16px 0' }}>
                <Typography variant="subtitle1">
                  <strong>{flight.Airline}</strong> - Departure: {flight.Departure}, Arrival: {flight.Arrival}
                </Typography>
                <Typography variant="body2">
                  Duration: {flight.Duration}, Price: <strong>${flight.Price}</strong>, Departure Time: {flight.Time}
                </Typography>
                <Typography variant="body2">
                Mode: {flight.Mode}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBookFlight(flight.ID)}
                  style={{ marginTop: '8px' }}
                >
                  Book Flight
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <Typography align="center" variant="body1">
            No flights found for the selected departure and arrival.
          </Typography>
        )}
      </Container>
    </div>
  );
};


export default Home ;
