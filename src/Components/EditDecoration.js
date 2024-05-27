// EditDecoration.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/edit.css'; // Import the CSS file for styling

const EditDecoration = ({ decoration_id, onClose, onUpdate, decoration }) => {
  const [decorationType, setDecorationType] = useState('');
  const [decorationCost, setDecorationCost] = useState('');
  const [contactDetails, setContactDetails] = useState('');

  // Set initial state based on the selected decoration
  useEffect(() => {
    if (decoration) {
      setDecorationType(decoration.decoration_type);
      setDecorationCost(decoration.decoration_cost);
      setContactDetails(decoration.contact_details);
    }
  }, [decoration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/decorations/${decoration_id}`, {
        decoration_type: decorationType,
        decoration_cost: decorationCost,
        contact_details: contactDetails
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating decoration:', error);
    }
  };

  return (
    <div className="edit-decoration-overlay">
      <div className="edit-decoration-container">
        <h3>Edit Decoration</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Decoration Type:</label>
            <input
              type="text"
              value={decorationType}
              onChange={(e) => setDecorationType(e.target.value)}
              required
            />
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
            <label>Contact Details:</label>
            <input
              type="text"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              required
            />
          </div>
          <div className="buttons">
            <button type="submit" className="green-button">Update</button>
            <button onClick={onClose} className="grey-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDecoration;
