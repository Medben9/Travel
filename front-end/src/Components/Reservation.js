import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';




const Reservation = () => {
  const { flightID, name, email } = useParams();
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationStatus, setReservationStatus] = useState(null);


  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3030/flig/${flightID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flight details');
        }

        const data = await response.json();
        console.log('Fetched flight details:', data);
        setFlightDetails(data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightID]);


  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error('Error:', error);
    return <Typography variant="h6">{`Failed to fetch flight details: ${error}`}</Typography>;
  }

  if (!flightDetails) {
    return <Typography variant="h6">No data received</Typography>;
  }

  const handleReservation = async () => {
    try {
      const response = await fetch('http://localhost:3030/add-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightDetails: {
            ID: flightDetails.ID,
            Departure: flightDetails.Departure,
            Arrival: flightDetails.Arrival,
            Price: flightDetails.Price,
            Duration: flightDetails.Duration,
          },
          name,
          email,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to make reservation');
      }
  
      const data = await response.json();
      console.log('Reservation successful:', data);
      setReservationStatus(data.message);
    } catch (error) {
      console.error('Error making reservation:', error);
      setReservationStatus(error.message);
    }
  };
  
  


  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Reservation Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Flight Information
            </Typography>
            <Typography variant="body1">
              Flight ID: {flightDetails.ID}
            </Typography>
            <Typography variant="body1">
              Departure: {flightDetails.Departure}
            </Typography>
            <Typography variant="body1">
              Arrival: {flightDetails.Arrival}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>
            <Typography variant="body1">
              Price: ${flightDetails.Price}
            </Typography>
            <Typography variant="body1">
              Duration: {flightDetails.Duration}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
          Passenger Information
        </Typography>
        <Typography variant="body1">
          Name: {name}
        </Typography>
        <Typography variant="body1">
          Email: {email}
        </Typography>
        <Button
        variant="contained"
        color="primary"
        onClick={handleReservation}
        style={{ marginTop: '20px' }}
      >
        Make Reservation
      </Button>
      {reservationStatus && (
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          {reservationStatus}
        </Typography>
      )}
      </Paper>
    </Container>
  );
};

export default Reservation;