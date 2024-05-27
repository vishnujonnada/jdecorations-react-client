import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/userorders.css';
import { useNavigate } from 'react-router-dom';
 // Import the CSS file for styling

const UserOrders = ({handleLogout}) => {
  const [orders, setOrders] = useState([]);
  const [showMenu, setShowMenu] = useState(false); // State for toggling the menu
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: '',
    mobile: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const { name, mobile } = response.data.user;
        setUserDetails({ name, mobile });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/userorders',
          {
            name: userDetails.name,
            mobile: userDetails.mobile
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (userDetails.name && userDetails.mobile) {
      fetchOrders();
    }
  }, [userDetails.name, userDetails.mobile]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
    <nav className="navbar">
    <div className="navbar-left">
      <h1>Jdecorations</h1>
    </div>
    <div className="navbar-right">
    <button onClick={() => setShowMenu(!showMenu)} className="menu-button">
        ☰
      </button>
      {showMenu && (
        <div className="dropdown-menu">
          <button onClick={() => navigate('/')}>Home</button>
          <button>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  </nav>
    <div className="user-orders-container">
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="order-item">
            <p>Decoration Type: {order.decoration_type}</p>
            <p>Decoration Cost: {order.decoration_cost}</p>
            <p>Event Date: {formatDate(order.event_date)}</p>
            <p>Event Place: {order.event_place}</p>
            <img src={`http://localhost:5000/${order.decoration_images[0].replace(/\\/g, '/')}`} alt={order.decoration_type} width="200" />
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
    </>
  );
};

export default UserOrders;
