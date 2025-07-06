import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, X } from 'lucide-react';
import BusinessForm from './components/BusinessForm';
import BusinessCard from './components/BusinessCard';
import EditBusinessModal from './components/EditBusinessModal';
import { businessAPI } from './services/api';
import './App.css';

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const data = await businessAPI.getBusinesses();
      setBusinesses(data);
    } catch (error) {
      console.error('Error loading businesses:', error);
      showToast('error', 'Failed to load businesses');
    }
  };

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleFormSubmit = async (formData) => {
    setIsFormLoading(true);
    try {
      const business = await businessAPI.createBusiness(formData);
      setCurrentBusiness(business);

      const existingIndex = businesses.findIndex((b) => b.id === business.id);
      if (existingIndex === -1) {
        setBusinesses((prev) => [...prev, business]);
        showToast('success', 'Business added successfully!');
      } else {
        showToast('info', 'Business data retrieved successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('error', 'Failed to get business data');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleRegenerateHeadline = async (business) => {
    setIsRegenerating(true);
    try {
      const { headline } = await businessAPI.regenerateHeadline(business.name, business.location, business.id);
      const updatedBusiness = { ...business, headline };
      setCurrentBusiness(updatedBusiness);
      setBusinesses((prev) => prev.map((b) => (b.id === business.id ? updatedBusiness : b)));
      showToast('success', 'SEO headline regenerated successfully!');
    } catch (error) {
      console.error('Error regenerating headline:', error);
      showToast('error', 'Failed to regenerate headline');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleEditBusiness = (business) => {
    setEditingBusiness(business);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id, data) => {
    setIsEditLoading(true);
    try {
      const updatedBusiness = await businessAPI.updateBusiness(id, data);
      setBusinesses((prev) => prev.map((b) => (b.id === id ? updatedBusiness : b)));
      if (currentBusiness?.id === id) {
        setCurrentBusiness(updatedBusiness);
      }
      setIsEditModalOpen(false);
      setEditingBusiness(null);
      showToast('success', 'Business updated successfully!');
    } catch (error) {
      console.error('Error updating business:', error);
      showToast('error', 'Failed to update business');
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDeleteBusiness = async (id) => {
    if (!window.confirm('Are you sure you want to delete this business?')) return;

    try {
      await businessAPI.deleteBusiness(id);
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
      if (currentBusiness?.id === id) {
        setCurrentBusiness(null);
      }
      showToast('success', 'Business deleted successfully!');
    } catch (error) {
      console.error('Error deleting business:', error);
      showToast('error', 'Failed to delete business');
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="icon-green" />;
      case 'error':
        return <AlertCircle className="icon-red" />;
      default:
        return <AlertCircle className="icon-blue" />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'toast toast-success';
      case 'error':
        return 'toast toast-error';
      default:
        return 'toast toast-info';
    }
  };

  return (
    <div className="app-container">
    
      <div className="header">
        <div className="header-inner">
          <div className="flex-row">
            <div className="logo-box">
              <TrendingUp className="icon-white" />
            </div>
            <div className="logo-text">
              <h1 className="app-title">GrowthProAI</h1>
              <p className="subtitle">Business Intelligence Dashboard</p>
            </div>
          </div>
          <div className="business-count">
            <p>
              {businesses.length} Business{businesses.length !== 1 ? 'es' : ''}
            </p>
            <p>Managed</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="grid-3col">
          <div>
            <BusinessForm onSubmit={handleFormSubmit} loading={isFormLoading} />
          </div>
          <div>
            {currentBusiness ? (
              <div>
                <div className="text-center">
                  <h2 className="section-title">Business Insights</h2>
                  <p className="section-subtitle">Here's what we found for your business</p>
                </div>
                <BusinessCard
                  business={currentBusiness}
                  onRegenerateHeadline={handleRegenerateHeadline}
                  onEdit={handleEditBusiness}
                  onDelete={handleDeleteBusiness}
                  isRegenerating={isRegenerating}
                />
              </div>
            ) : (
              <div className="card-section">
                <TrendingUp className="card-icon" />
                <h3 className="card-title">Ready to Analyze Your Business?</h3>
                <p className="card-text">
                  Enter your business details to get insights about your Google presence and SEO performance.
                </p>
                <div className="features-grid">
                  <div className="feature-box feature-blue">
                    <div>Google Rating</div>
                    <div>Real-time insights</div>
                  </div>
                  <div className="feature-box feature-emerald">
                    <div>SEO Headlines</div>
                    <div>AI-powered content</div>
                  </div>
                  <div className="feature-box feature-purple">
                    <div>Reviews</div>
                    <div>Customer feedback</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {businesses.length > 0 && (
          <div className="all-section">
            <div className="text-center">
              <h2 className="section-title">All Businesses</h2>
              <p className="section-subtitle">Manage all your business listings</p>
            </div>
            <div className="business-grid">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onRegenerateHeadline={handleRegenerateHeadline}
                  onEdit={handleEditBusiness}
                  onDelete={handleDeleteBusiness}
                  isRegenerating={isRegenerating}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <EditBusinessModal
        business={editingBusiness}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBusiness(null);
        }}
        onSave={handleSaveEdit}
        loading={isEditLoading}
      />

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={getToastStyles(toast.type)}>
            {getToastIcon(toast.type)}
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)}>
              <X className="icon-close" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
