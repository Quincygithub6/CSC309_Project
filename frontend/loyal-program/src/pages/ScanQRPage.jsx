import { useState } from 'react';
import { transactionAPI } from '../api';
import './ScanQRPage.css';

const ScanQRPage = () => {
  const [qrInput, setQrInput] = useState('');
  const [points, setPoints] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleQrInput = (e) => {
    setQrInput(e.target.value);
    setError('');
    setSuccess(false);
    
    try {
      const data = JSON.parse(e.target.value);
      if ((data.type === 'user' && data.userId) || (data.type === 'redemption' && data.requestId)) {
        setUserInfo(data);
      }
    } catch (err) {
      setUserInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!qrInput.trim()) {
      setError('Please scan or enter QR code data');
      return;
    }

    if (!points || parseFloat(points) <= 0) {
      setError('Please enter a valid point amount');
      return;
    }

    try {
      setLoading(true);
      
      const qrData = JSON.parse(qrInput);
      
      // Handle redemption requests
      if (qrData.type === 'redemption' && qrData.requestId) {
        await transactionAPI.processRedemption(qrData.requestId);
        setSuccess(true);
        setQrInput('');
        setPoints('');
        setNote('');
        setUserInfo(null);
        setTimeout(() => setSuccess(false), 3000);
        return;
      }
      
      // Handle regular user QR for awarding points
      if (qrData.type !== 'user' || !qrData.userId) {
        setError('Invalid QR code format');
        return;
      }

      await transactionAPI.awardPoints({
        userId: qrData.userId,
        points: parseFloat(points),
        note: note.trim() || 'Points awarded via QR scan'
      });

      setSuccess(true);
      setQrInput('');
      setPoints('');
      setNote('');
      setUserInfo(null);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error processing request:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Scan QR Code</h1>

      <div className="scan-container">
        <div className="scan-card">
          <div className="scan-header">
            <h2>Scan QR Code</h2>
            <p>Scan user QR to award points or redemption request QR to process redemption</p>
          </div>

          {success && (
            <div className="success-banner">
              {userInfo?.type === 'redemption' ? 'Redemption processed successfully!' : 'Points awarded successfully!'}
            </div>
          )}

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="scan-form">
            <div className="form-group">
              <label htmlFor="qrInput">QR Code Data</label>
              <textarea
                id="qrInput"
                value={qrInput}
                onChange={handleQrInput}
                placeholder='Paste QR code data here (e.g., {"type":"user","userId":1,"utorid":"user1"})'
                rows={4}
                disabled={loading}
                required
              />
              <p className="field-hint">
                In a real app, this would use camera scanning. For now, paste the QR code JSON data.
              </p>
            </div>

            {userInfo && userInfo.type === 'user' && (
              <div className="user-info-card">
                <h3>User Information</h3>
                <p><strong>UTORid:</strong> {userInfo.utorid}</p>
                <p><strong>User ID:</strong> {userInfo.userId}</p>
              </div>
            )}

            {userInfo && userInfo.type === 'redemption' && (
              <div className="user-info-card redemption-info">
                <h3>Redemption Request</h3>
                <p><strong>Request ID:</strong> {userInfo.requestId}</p>
                <p><strong>Points to Redeem:</strong> {userInfo.amount}</p>
                <p className="warning-text">Click "Process Redemption" to complete this request</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="points">Points to Award</label>
              <input
                id="points"
                type="number"
                min="1"
                step="1"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Enter points amount"
                disabled={loading || (userInfo?.type === 'redemption')}
                required={userInfo?.type !== 'redemption'}
              />
              {userInfo?.type === 'redemption' && (
                <p className="field-hint">Points field not needed for redemption requests</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="note">Note (Optional)</label>
              <input
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for this transaction"
                disabled={loading || (userInfo?.type === 'redemption')}
                maxLength={200}
              />
              {userInfo?.type === 'redemption' && (
                <p className="field-hint">Note field not needed for redemption requests</p>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !userInfo}
            >
              {loading ? 'Processing...' : (userInfo?.type === 'redemption' ? 'Process Redemption' : 'Award Points')}
            </button>
          </form>

          <div className="help-section">
            <h3>How to use:</h3>
            <h4>For awarding points:</h4>
            <ol>
              <li>Ask the user to show their QR code from "My QR Code" page</li>
              <li>In a real app, scan it with camera. For testing, copy and paste the QR data</li>
              <li>Enter the number of points to award</li>
              <li>Optionally add a note</li>
              <li>Click "Award Points" to complete the transaction</li>
            </ol>
            <h4>For processing redemptions:</h4>
            <ol>
              <li>Ask the user to show their redemption request QR code</li>
              <li>Scan or paste the redemption QR data</li>
              <li>Verify the request details</li>
              <li>Click "Process Redemption" to complete</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQRPage;
