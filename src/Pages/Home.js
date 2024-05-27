import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/home.css'; // Import the CSS file for styling

const Home = ({ handleLogout }) => {
  const [decorations, setDecorations] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [eventDate, setEventDate] = useState('');
  const [eventPlace, setEventPlace] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    mobile: ''
  });
  const [selectedType, setSelectedType] = useState(''); // State for selected decoration type
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message
  const [showMenu, setShowMenu] = useState(false); // State for toggling the menu
  const [showDetails, setShowDetails] = useState({}); // State for showing details

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecorations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/decorations');
        setDecorations(response.data);
      } catch (error) {
        console.error('Error fetching decorations:', error);
      }
    };

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

    fetchDecorations();
    fetchUserProfile();
  }, []);

  const handleOrderClick = (decoration) => {
    setSelectedDecoration(decoration);
    setShowOrderForm(true);
    setShowSuccessMessage(false); // Hide success message when opening a new order form
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const orderDetails = {
      decoration_id: selectedDecoration._id,
      decoration_type: selectedDecoration.decoration_type,
      decoration_cost: selectedDecoration.decoration_cost,
      decoration_images: selectedDecoration.decoration_images,
      user_details: userDetails,
      event_date: eventDate,
      event_place: eventPlace,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/order', orderDetails);
      console.log('Order placed:', response.data);
      setShowOrderForm(false);
      setShowSuccessMessage(true); // Show success message

      // Clear form inputs and selected decoration after successful submission
      setEventDate('');
      setEventPlace('');
      setUserDetails({ name: '', mobile: '' });
      setSelectedDecoration(null);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  // Function to handle decoration type change
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  // Function to handle showing details
  const handleShowDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter decorations based on selected type
  const filteredDecorations = selectedType
    ? decorations.filter(decoration => decoration.decoration_type === selectedType)
    : decorations;

  return (
    <div className="home-container">
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
              <button onClick={() => navigate('/user-orders')}>My Orders</button>
              <button onClick={() => console.log('Profile')}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
      <h3>Welcome to Jdecorations!</h3>

      {/* Dropdown menu for selecting decoration type */}
      <div className="dropdown-container">
        <label>Select Decoration Type:</label>
        <select value={selectedType} onChange={handleTypeChange}>
          <option value="">All</option>
          {/* Extract unique decoration types */}
          {[...new Set(decorations.map(decoration => decoration.decoration_type))].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="decorations-container">
        {filteredDecorations.map((decoration) => (
          <div key={decoration._id} className="decoration-item">
            <img className='deco-image' src={`http://localhost:5000/${decoration.decoration_images[0].replace(/\\/g, '/')}`} alt={decoration.decoration_type} width={1000} />
            <p>Cost: {decoration.decoration_cost}</p>
            <button onClick={() => handleOrderClick(decoration)}>Order</button>
            <button onClick={() => handleShowDetails(decoration._id)}>
              {showDetails[decoration._id] ? 'Hide Details' : 'More Details'}
            </button>
            {showDetails[decoration._id] && (
              <div className="decoration-details">
                <p>ID: {decoration.decoration_id}</p>
                <p>Contact: {decoration.contact_details}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showOrderForm && (
        <div className="order-form-overlay">
          <div className="order-form-container">
            <button className="close-button" onClick={() => setShowOrderForm(false)}>X</button>
            <h3>Order Decoration</h3>
            <form onSubmit={handleOrderSubmit}>
              <div>
                <label>Event Date:</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Event Place:</label>
                <input
                  type="text"
                  value={eventPlace}
                  onChange={(e) => setEventPlace(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Name:</label>
                <span>{userDetails.name}</span>
              </div>
              <div>
                <label>Mobile:</label>
                <span>{userDetails.mobile}</span>
              </div>
              <button type="submit">Submit Order</button>
            </form>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="success-message">
          <span>✔</span> Your order was placed successfully!
        </div>
      )}
    </div>
  );
};

export default Home;
