import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userAPI, transactionAPI, eventAPI, promotionAPI } from '../api';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalEvents: 0,
    totalPromotions: 0,
    activePromotions: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      const [usersRes, transactionsRes, eventsRes, promotionsRes] = await Promise.all([
        userAPI.getUsers({ limit: 1 }),
        transactionAPI.getTransactions({ limit: 1 }),
        eventAPI.getEvents({ limit: 100 }),
        promotionAPI.getPromotions({ limit: 100 })
      ]);

      const totalUsers = usersRes.data?.count || 0;
      const totalTransactions = transactionsRes.data?.count || 0;
      
      const events = eventsRes.data?.results || [];
      const totalEvents = eventsRes.data?.count || 0;
      const now = new Date();
      const upcomingEvents = events.filter(e => new Date(e.startTime) > now).length;

      const promotions = promotionsRes.data?.results || [];
      const totalPromotions = promotionsRes.data?.count || 0;
      const activePromotions = promotions.filter(p => new Date(p.endTime) > now).length;

      setStats({
        totalUsers,
        totalTransactions,
        totalEvents,
        totalPromotions,
        activePromotions,
        upcomingEvents
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="page-title">Manager Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name || user?.utorid}</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">Transactions</div>
          <div className="stat-value">{stats.totalTransactions}</div>
          <div className="stat-label">Total Transactions</div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">Events</div>
          <div className="stat-value">{stats.upcomingEvents}/{stats.totalEvents}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">Promotions</div>
          <div className="stat-value">{stats.activePromotions}/{stats.totalPromotions}</div>
          <div className="stat-label">Active Promotions</div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/manager/users" className="action-card">
            <h3>Manage Users</h3>
            <p>View and edit user accounts</p>
          </Link>

          <Link to="/manager/events" className="action-card">
            <h3>Manage Events</h3>
            <p>Create and manage events</p>
          </Link>

          <Link to="/manager/promotions" className="action-card">
            <h3>Manage Promotions</h3>
            <p>Create and manage promotions</p>
          </Link>

          <Link to="/manager/transactions" className="action-card">
            <h3>View Transactions</h3>
            <p>Monitor all transactions</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
