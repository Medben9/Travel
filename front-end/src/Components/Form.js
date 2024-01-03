import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const Form = () => {
  const { flightID } = useParams();
  const [passengerInfo, setPassengerInfo] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [newPassengerInfo, setNewPassengerInfo] = useState({ name: '', email: '' });
  const [registrationConfirmationDialogOpen, setRegistrationConfirmationDialogOpen] = useState(false);
  

  useEffect(() => {
    // Assuming you have a function to fetch flight details based on flightID
    const fetchFlightDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3030/flig/${flightID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flight details');
        }

        // You can use the fetched flight details as needed
        const data = await response.json();
        console.log('Fetched flight details:', data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
      }
    };

    fetchFlightDetails();
  }, [flightID]);

  const openRegistrationDialog = () => {
    setRegistrationDialogOpen(true);
  };

  const closeRegistrationDialog = () => {
    setRegistrationDialogOpen(false);
  };

  const openRegistrationConfirmationDialog = () => {
    setRegistrationConfirmationDialogOpen(true);
  };

  const closeRegistrationConfirmationDialog = () => {
    setRegistrationConfirmationDialogOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPassengerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleNewPassengerInputChange = (event) => {
    const { name, value } = event.target;
    setNewPassengerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleCheckAvailability = () => {
    setLoading(true);
  
    const { name: passengerName, email: passengerEmail } = passengerInfo;
  
    fetch(`http://localhost:3030/passengers?Name=${passengerName}&Email=${passengerEmail}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Response from server:', data);
        if (data.success) {
          alert('Passenger found!');
          handleReservation(flightID, passengerName, passengerEmail);
        } else {
          openRegistrationDialog();
        }
      })
      .catch((error) => {
        console.error('Error checking passenger availability:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const handleReservation = (flightID, passengerName, passengerEmail) => {
    navigate(`/Reservation/${flightID}/${passengerName}/${passengerEmail}`);
  };

  const handleRegister = () => {
    fetch('http://localhost:3030/add-passengers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPassengerInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Passenger registered successfully:', data);
        closeRegistrationDialog();
        setNewPassengerInfo({ name: '', email: '' });
        openRegistrationConfirmationDialog();
        navigate(`/Reservation/${flightID}/${newPassengerInfo.name}/${newPassengerInfo.email}`);
      })
      .catch((error) => {
        console.error('Error registering passenger:', error);
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <form>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={passengerInfo.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={passengerInfo.email}
          onChange={handleInputChange}
        />
      </form>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleCheckAvailability(flightID)}
        style={{ marginTop: '16px' }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Check Availability'}
      </Button>

      {/* Registration Dialog */}
      <Dialog open={registrationDialogOpen} onClose={closeRegistrationDialog}>
        <DialogTitle>Passenger Not Found</DialogTitle>
        <DialogContent>
          <p>We couldn't find your information. Would you like to register?</p>
          {/* Additional form fields for registration */}
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={newPassengerInfo.name}
            onChange={handleNewPassengerInputChange}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={newPassengerInfo.email}
            onChange={handleNewPassengerInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRegistrationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRegister} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Registration Confirmation Dialog */}
      <Dialog open={registrationConfirmationDialogOpen} onClose={closeRegistrationConfirmationDialog}>
        {/* ... (dialog content) */}
        <DialogActions>
          <Button onClick={closeRegistrationConfirmationDialog} color="primary">
            OK
          </Button>
          <Button
            onClick={() => {
              closeRegistrationConfirmationDialog();
              handleReservation(flightID, passengerInfo.name, passengerInfo.email);
            }}
            color="primary"
          >
            Confirm Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Form;
