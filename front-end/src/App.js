import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Book from './Pages/Book';
import Reservation from './Components/Reservation';
import Admin from './Pages/Admin'; // Import the Admin component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Book/:flightID" element={<Book />} />
        <Route path="/Reservation/:flightID/:name/:email" element={<Reservation />} />
        <Route path="/Admin" element={<Admin />} /> {/* Add this line for the Admin route */}
      </Routes>
    </Router>
  );
};

export default App;