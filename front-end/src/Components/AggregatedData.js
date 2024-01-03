// In AggregatedData.js
import React, { useState, useEffect } from 'react';
import { Typography, Paper, Divider, ListItem, ListItemText, List } from '@mui/material';

const AggregatedData = () => {
  const [averageTicketPriceByDestination, setAverageTicketPriceByDestination] = useState([]);
  const [busiestTravelRoutes, setBusiestTravelRoutes] = useState([]);
  const [totalRevenueByTravelAgency, setTotalRevenueByTravelAgency] = useState([]);
  const [mostPopularDestinations, setMostPopularDestinations] = useState([]);

  useEffect(() => {
    const fetchAggregationData = async () => {
      try {
        // Fetch Average Ticket Price by Destination
        const averageTicketPriceResponse = await fetch('http://localhost:3030/averageTicketPriceByDestination');
        const averageTicketPriceData = await averageTicketPriceResponse.json();
        setAverageTicketPriceByDestination(averageTicketPriceData);

        // Fetch Busiest Travel Routes
        const busiestRoutesResponse = await fetch('http://localhost:3030/busiest-routes');
        const busiestRoutesData = await busiestRoutesResponse.json();
        setBusiestTravelRoutes(busiestRoutesData);

        // Fetch Total Revenue by Travel Agency
        const totalRevenueResponse = await fetch('http://localhost:3030/total-revenue-by-travel-agency');
        const totalRevenueData = await totalRevenueResponse.json();
        setTotalRevenueByTravelAgency(totalRevenueData);

        // Fetch Most Popular Destinations
        const mostPopularDestinationsResponse = await fetch('http://localhost:3030/most-popular-destinations');
        const mostPopularDestinationsData = await mostPopularDestinationsResponse.json();
        setMostPopularDestinations(mostPopularDestinationsData);
      } catch (error) {
        console.error('Error fetching aggregation data:', error);
      }
    };

    fetchAggregationData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} style={{ width: '70%', padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6">Average Ticket Price by Destination</Typography>
        <List>
          {averageTicketPriceByDestination.map((result, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${result._id}: ${result.averageTicketPrice}`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} style={{ width: '70%', padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6">Busiest Travel Routes</Typography>
        <List>
          {busiestTravelRoutes.map((route, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={`${route._id.departure} to ${route._id.arrival}: ${route.routeCount} reservations`} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} style={{ width: '70%', padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6">Total Revenue by Travel Agency</Typography>
        <List>
          {totalRevenueByTravelAgency.map((result, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${result.TravelAgency}: ${result.TotalRevenue}`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} style={{ width: '70%', padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6">Most Popular Destinations</Typography>
        <List>
          {mostPopularDestinations.map((destination, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={`${destination.Destination}: ${destination.DestinationCount} reservations`} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default AggregatedData;
