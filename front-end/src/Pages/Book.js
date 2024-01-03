import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, CircularProgress } from '@mui/material';
import Navbar from '../Components/Navbar';
import Form from '../Components/Form';

const Book = () => {
  const { flightID } = useParams();
  const [detailedFlightData, setDetailedFlightData] = useState(null);



  useEffect(() => {
    // Endpoint for fetching detailed flight information
    const flightDetailsEndpoint = `http://localhost:3030/flig/${flightID}`;
    // Fetch detailed flight information
    fetch(flightDetailsEndpoint)
      .then(response => response.json())
      .then(data => {
        // Here, you can set the detailed flight data in your component state
        setDetailedFlightData(data);
      })
      .catch(error => console.error('Error fetching detailed flight information:', error));
  }, [flightID]);

     return (
    <>
      <Navbar />
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Typography variant="h3" align="center" gutterBottom>
          Enter information to book your flight
        </Typography>

        {detailedFlightData ? (
          <>
            <Typography variant="subtitle1">
              <strong>{detailedFlightData.Airline}</strong> - Departure: {detailedFlightData.Departure}, Arrival: {detailedFlightData.Arrival}
            </Typography>
            <Typography variant="body2">
              Duration: {detailedFlightData.Duration}, Price: <strong>${detailedFlightData.Price}</strong>, Departure Time: {detailedFlightData.Time}
            </Typography>
            {/* Add other details based on your flight data */}
          </>
        ) : (
          <Typography align="center" variant="body1">
            <CircularProgress />
          </Typography>
        )}
        
        
      </Container>

       {/* Form for collecting passenger information */}

      <Form />

       {/* Form for collecting passenger information */}
    </>
  );
};

export default Book;
