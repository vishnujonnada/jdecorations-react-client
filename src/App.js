import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Components/Login';
import Admin from './Pages/Admin';
import Signup from './Components/Signup';
import Order from './Components/Order';
import UserOrders from './Components/UserOrders';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Home handleLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <Admin handleLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/order"
          element={isAuthenticated ? <Order handleLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/user-orders"
          element={isAuthenticated ? <UserOrders handleLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
