import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Order = ({handleLogout}) => {
  const [orders, setOrders] = useState([]);
  
  const [showMenu, setShowMenu] = useState(false); // State for toggling the menu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

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
          <button onClick={() => navigate('/admin')}>Dashboard</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  </nav>
    <div style={styles.container}>
      <h2 style={styles.header}>Orders</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Decoration Type</th>
            <th style={styles.th}>Decoration Cost</th>
            <th style={styles.th}>Event Date</th>
            <th style={styles.th}>Event Place</th>
            <th style={styles.th}>User Name</th>
            <th style={styles.th}>User Mobile</th>
            <th style={styles.th}>Decoration Images</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={styles.tr}>
              <td style={styles.td}>{order.decoration_type}</td>
              <td style={styles.td}>{order.decoration_cost}</td>
              <td style={styles.td}>{order.event_date ? new Date(order.event_date).toLocaleDateString() : 'N/A'}</td>
              <td style={styles.td}>{order.event_place || 'N/A'}</td>
              <td style={styles.td}>{order.user_details ? order.user_details.name : 'N/A'}</td>
              <td style={styles.td}>{order.user_details ? order.user_details.mobile : 'N/A'}</td>
              <td style={styles.td}>
                {order.decoration_images && order.decoration_images.length > 0 ? (
                  order.decoration_images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/${image.replace(/\\/g, '/')}`}
                      alt={`Decoration ${index + 1}`}
                      style={styles.image}
                    />
                  ))
                ) : (
                  'No images'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  },
  tr: {
    '&:nth-child(even)': {
      backgroundColor: '#f9f9f9',
    },
    '&:hover': {
      backgroundColor: '#ddd',
    },
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  image: {
    width: '100px',
    borderRadius: '5px',
  },
};

export default Order;
