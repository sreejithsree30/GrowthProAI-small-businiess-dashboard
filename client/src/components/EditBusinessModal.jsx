import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, Save, Loader2 } from 'lucide-react';
import './EditBusinessModal.css';

const EditBusinessModal = ({ business, isOpen, onClose, onSave, loading }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (business) {
      setName(business.name);
      setLocation(business.location);
      setErrors({});
    }
  }, [business]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Business name is required';
    else if (name.trim().length < 2) newErrors.name = 'Business name must be at least 2 characters';

    if (!location.trim()) newErrors.location = 'Location is required';
    else if (location.trim().length < 2) newErrors.location = 'Location must be at least 2 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && business) {
      onSave(business.id, { name: name.trim(), location: location.trim() });
    }
  };

  if (!isOpen || !business) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Business</h2>
          <button onClick={onClose} className="close-button">
            <X className="icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div>
            <label htmlFor="editBusinessName">Business Name</label>
            <div className="input-wrapper">
              <Building2 className="input-icon" />
              <input
                type="text"
                id="editBusinessName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Cake & Co"
                className={`form-input ${errors.name ? 'error' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="editLocation">Location</label>
            <div className="input-wrapper">
              <MapPin className="input-icon" />
              <input
                type="text"
                id="editLocation"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Mumbai"
                className={`form-input ${errors.location ? 'error' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.location && <p className="error-text">{errors.location}</p>}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="icon" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBusinessModal;
