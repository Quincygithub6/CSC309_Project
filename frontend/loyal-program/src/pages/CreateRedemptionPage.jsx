import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { transactionAPI } from '../api';
import './CreateRedemptionPage.css';

const CreateRedemptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    remark: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    const amount = parseInt(formData.amount, 10);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (amount > user.points) {
      setError(`Insufficient points. You have ${user.points} points available.`);
      return;
    }

    try {
      setLoading(true);
      await transactionAPI.createRedemption(amount, formData.remark);
      setSuccess(true);
      
      // Redirect to My Redemptions page after 2 seconds
      setTimeout(() => {
        navigate('/redemptions');
      }, 2000);
    } catch (err) {
      console.error('Error creating redemption:', err);
      setError(err.response?.data?.message || 'Failed to create redemption request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user?.verified) {
    return (
      <div className="page-container">
        <div className="error-banner">
          You must be a verified user to create redemption requests.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Create Redemption Request</h1>

      <div className="info-card">
        <p>Available Points: <strong>{user.points}</strong></p>
        <p className="info-text">
          Create a redemption request to exchange your points for rewards. 
          Once created, show the QR code to a cashier to complete the redemption.
        </p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {success && (
        <div className="success-banner">
          Redemption request created successfully! Redirecting to your redemptions...
        </div>
      )}

      <form onSubmit={handleSubmit} className="redemption-form">
        <div className="form-group">
          <label htmlFor="amount">Points to Redeem *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            min="1"
            max={user.points}
            required
            disabled={loading}
          />
          <span className="field-hint">
            Maximum: {user.points} points
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="remark">Remark (Optional)</label>
          <textarea
            id="remark"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            placeholder="Add a note about this redemption (e.g., 'Coffee mug', 'Gift card')"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRedemptionPage;
