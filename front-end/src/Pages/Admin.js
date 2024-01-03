import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, TextField } from '@mui/material';
import AggregatedData from '../Components/AggregatedData';

const Admin = () => {
  const [deleteParams, setDeleteParams] = useState({ collection: '', ID: '' });
  const [deleteResult, setDeleteResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeleteParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3030/delete/${deleteParams.collection}/${deleteParams.ID}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      setDeleteResult(data);
    } catch (error) {
      console.error('Error deleting:', error);
      if (error.response) {
        console.log('Server response:', await error.response.text());
      }
    }
  };
  

  return (
    <>
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6">Delete Entry from Collection</Typography>
        <TextField
          name="collection"
          label="Collection"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          name="ID"
          label="Entry ID"
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleDelete}>
          Delete Entry
        </Button>
        {deleteResult && (
          <Typography variant="body1" style={{ marginTop: '10px' }}>
            {deleteResult.success ? 'Deletion successful' : 'Deletion failed'}: {deleteResult.message}
          </Typography>
        )}
      </Paper>
    </Container>
    <AggregatedData />
    </>

  );
};

export default Admin;
