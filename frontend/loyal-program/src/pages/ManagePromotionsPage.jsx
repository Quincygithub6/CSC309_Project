import { useState, useEffect } from 'react';
import { promotionAPI } from '../api';
import './ManagePromotionsPage.css';

const ManagePromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endTime: ''
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await promotionAPI.getPromotions({ limit: 100 });
      const data = response.data?.results || response.data || [];
      setPromotions(data);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      await promotionAPI.createPromotion(formData);
      
      setSuccess('Promotion created successfully');
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        endTime: ''
      });
      fetchPromotions();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating promotion:', err);
      setError(err.response?.data?.error || 'Failed to create promotion');
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) {
      return;
    }
    
    try {
      setError('');
      await promotionAPI.deletePromotion(promotionId);
      setSuccess('Promotion deleted successfully');
      fetchPromotions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting promotion:', err);
      setError(err.response?.data?.error || 'Failed to delete promotion');
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isActive = (endTime) => {
    return new Date(endTime) > new Date();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manage Promotions</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-btn"
        >
          {showCreateForm ? 'Cancel' : 'Create New Promotion'}
        </button>
      </div>

      {success && (
        <div className="success-banner">
          {success}
        </div>
      )}

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="create-form-section">
          <h2>Create New Promotion</h2>
          <form onSubmit={handleCreatePromotion} className="promotion-form">
            <div className="form-group">
              <label htmlFor="name">Promotion Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Promotion
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <p>Loading promotions...</p>
        </div>
      ) : (
        <div className="promotions-list">
          {promotions.length === 0 ? (
            <p className="empty-message">No promotions found</p>
          ) : (
            promotions.map((promotion) => (
              <div key={promotion.id} className="promotion-item">
                <div className="promotion-main">
                  <div className="promotion-header-row">
                    <h3>{promotion.name}</h3>
                    <span className={`status ${isActive(promotion.endTime) ? 'active' : 'expired'}`}>
                      {isActive(promotion.endTime) ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <p className="promotion-description">{promotion.description}</p>
                  <p className="promotion-time">
                    Ends: {formatDateTime(promotion.endTime)}
                  </p>
                </div>
                <div className="promotion-actions">
                  <button
                    onClick={() => handleDeletePromotion(promotion.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManagePromotionsPage;
