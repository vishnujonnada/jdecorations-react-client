import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditDecoration from '../Components/EditDecoration';
import DeleteDecoration from '../Components/DeleteDecoration';
import '../Styles/admin.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [decorations, setDecorations] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [decorationType, setDecorationType] = useState('');
  const [decorationCost, setDecorationCost] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [decorationImages, setDecorationImages] = useState([]);
  const [showMenu, setShowMenu] = useState(false); // State for toggling the menu
  const navigate = useNavigate();

  const fetchDecorations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/decorations');
      setDecorations(response.data);
    } catch (error) {
      console.error('Error fetching decorations:', error);
    }
  };

  useEffect(() => {
    fetchDecorations();
  }, []);

  const handleEdit = (decoration) => {
    setSelectedDecoration(decoration);
    setShowEditModal(true);
  };

  const handleDelete = (decoration) => {
    setSelectedDecoration(decoration);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedDecoration(null);
  };

  const handleUpdateDecoration = (updatedDecoration) => {
    const updatedDecorations = decorations.map(decoration =>
      decoration._id === updatedDecoration._id ? updatedDecoration : decoration
    );
    setDecorations(updatedDecorations);
  };

  const handleDeleteDecoration = (deletedId) => {
    const updatedDecorations = decorations.filter(decoration =>
      decoration._id !== deletedId
    );
    setDecorations(updatedDecorations);
  };

  const handleAddDecoration = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('decoration_type', decorationType);
      formData.append('decoration_cost', decorationCost);
      formData.append('contact_details', contactDetails);
      decorationImages.forEach(image => formData.append('decoration_images', image));
      
      const response = await axios.post('http://localhost:5000/api/admin/add-decoration', formData);
      console.log(response.data);
      // Update decorations list after adding
      fetchDecorations();
      // Clear input fields
      setDecorationType('');
      setDecorationCost('');
      setContactDetails('');
      setDecorationImages([]);
    } catch (error) {
      console.error('Error adding decoration:', error);
    }
  };

  const handleImageChange = (e) => {
    // Append the new image files to the existing array
    setDecorationImages([...decorationImages, ...e.target.files]);
  };
  
  return (
    <div className="admin-container">
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
              <button onClick={() => navigate('/order')}>Orders</button>
              <button>Logout</button>
            </div>
          )}
        </div>
      </nav>
      <h2>Admin Dashboard</h2>
      <div className='add-container'>
      <form onSubmit={handleAddDecoration} className="decoration-form">
        <div>
          <label>Decoration Type:</label>
          <select
            value={decorationType}
            onChange={(e) => setDecorationType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="home">Home</option>
            <option value="marriage">Marriage</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Decoration Cost:</label>
          <input
            type="text"
            value={decorationCost}
            onChange={(e) => setDecorationCost(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Decoration Images:</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            required
          />
        </div>
        <div>
          <label>Contact Details:</label>
          <input
            type="text"
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Decoration</button>
      </form>
      </div>
      <div>
        <h2>Decorations List</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Cost</th>
                <th>Contact Details</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {decorations.map(decoration => (
                <tr key={decoration._id}>
                  <td data-label="ID">{decoration.decoration_id}</td>
                  <td data-label="Type">{decoration.decoration_type}</td>
                  <td data-label="Cost">{decoration.decoration_cost}</td>
                  <td data-label="Contact Details">{decoration.contact_details}</td>
                  <td data-label="Images">
                  {decoration.decoration_images && decoration.decoration_images.length > 0 ? (
                    decoration.decoration_images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/${image.replace(/\\/g, '/')}`}
                        alt={`Decoration ${index + 1}`}
                        width={100}
                      />
                    ))
                  ) : (
                    'No images'
                  )}
                </td>
                  <td data-label="Actions">
                    <button onClick={() => handleEdit(decoration)}>Edit</button>
                    <button onClick={() => handleDelete(decoration)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showEditModal && (
        <EditDecoration
          decoration_id={selectedDecoration._id}
          onClose={handleCloseModals}
          onUpdate={handleUpdateDecoration}
          decoration={selectedDecoration}
        />
     
      )}
      {showDeleteModal && (
        <DeleteDecoration
          id={selectedDecoration._id}
          onClose={handleCloseModals}
          onDelete={handleDeleteDecoration}
        />
      )}
    </div>
);
};

export default Admin;
