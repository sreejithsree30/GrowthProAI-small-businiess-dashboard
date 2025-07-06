import React, { useState } from 'react';
import { Building2, MapPin, Search, Loader2 } from 'lucide-react';
import './BusinessForm.css'; 

const BusinessForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Business name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Business name must be at least 2 characters';
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    } else if (location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ name: name.trim(), location: location.trim() });
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Business Dashboard</h2>
        <p>Enter your business details to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="form-body">
        <div>
          <label htmlFor="businessName">Business Name</label>
          <div className="input-wrapper">
            <Building2 className="input-icon" />
            <input
              type="text"
              id="businessName"
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
          <label htmlFor="location">Location</label>
          <div className="input-wrapper">
            <MapPin className="input-icon" />
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Mumbai"
              className={`form-input ${errors.location ? 'error' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.location && <p className="error-text">{errors.location}</p>}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (
            <>
              <Loader2 className="spinner" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="icon" />
              Get Business Insights
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BusinessForm;
