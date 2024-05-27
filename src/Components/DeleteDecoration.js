// DeleteDecoration.js

import React from 'react';
import axios from 'axios';
import '../Styles/delete.css'; // Import the CSS file for styling

const DeleteDecoration = ({ id, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/admin/decorations/${id}`);
      console.log(response.data);
      onDelete(id);
      onClose();
    } catch (error) {
      console.error('Error deleting decoration:', error);
    }
  };

  return (
    <div className="delete-decoration-overlay">
      <div className="delete-decoration-container">
        <h3>Delete Decoration</h3>
        <p>Are you sure you want to delete this decoration?</p>
        <div className="buttons">
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDecoration;
