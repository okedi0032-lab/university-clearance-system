import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clearanceService, notificationService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [clearanceStatus, setClearanceStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch clearance requests
        const requestsResponse = await clearanceService.getStudentRequests();
        if (requestsResponse.data && requestsResponse.data.data.length > 0) {
          const latestRequest = requestsResponse.data.data[0];
          setClearanceStatus(latestRequest);
        }

        // Fetch notifications
        const notificationsResponse = await notificationService.getNotifications({ isRead: false });
        setNotifications(notificationsResponse.data.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitClearance = async () => {
    try {
      setLoading(true);
      const response = await clearanceService.createRequest();
      setClearanceStatus(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to submit clearance request');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return '#22863a';
      case 'PENDING':
        return '#b08500';
      case 'REJECTED':
        return '#cb2431';
      case 'NOT_STARTED':
        return '#6a737d';
      default:
        return '#24292e';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return '✅';
      case 'PENDING':
        return '⏳';
      case 'REJECTED':
        return '❌';
      case 'NOT_STARTED':
        return '📋';
      default:
        return '❓';
    }
  };

  if (loading && !clearanceStatus) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">📋 University Clearance System</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
              <div className="user-details">
                <p className="user-name">{user?.email}</p>
                <p className="user-role">{user?.role || 'Student'}</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`nav-item ${activeTab === 'clearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('clearance')}
            >
              ✅ My Clearance
            </button>
            <button
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Notifications ({notifications.length})
            </button>
            <button
              className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => setActiveTab('help')}
            >
              ❓ Help
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="welcome-section">
                <h2>Welcome back, {user?.email?.split('@')[0]}! 👋</h2>
                <p>Track your graduation clearance status across all departments</p>
              </div>

              {!clearanceStatus ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <h3>No Clearance Request Yet</h3>
                  <p>Start your graduation clearance process by submitting a new request.</p>
                  <button
                    className="primary-btn"
                    onClick={handleSubmitClearance}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Clearance Request'}
                  </button>
                </div>
              ) : (
                <div className="status-overview">
                  <div className="status-header">
                    <h3>Your Clearance Status</h3>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(clearanceStatus.status) }}>
                      {getStatusIcon(clearanceStatus.status)} {clearanceStatus.status}
                    </span>
                  </div>

                  <div className="departments-grid">
                    {clearanceStatus.departments?.map((dept) => (
                      <div key={dept.id} className="department-card">
                        <div className="dept-header">
                          <h4>{dept.name}</h4>
                          <span className="dept-status" style={{ backgroundColor: getStatusColor(dept.status) }}>
                            {getStatusIcon(dept.status)}
                          </span>
                        </div>
                        <div className="dept-content">
                          <p className="dept-status-text">{dept.status}</p>
                          {dept.status === 'REJECTED' && dept.comments && (
                            <div className="dept-comments">
                              <strong>Reason:</strong> {dept.comments}
                            </div>
                          )}
                          {dept.status === 'APPROVED' && dept.reviewedAt && (
                            <p className="dept-date">
                              Approved on {new Date(dept.reviewedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {clearanceStatus.status === 'APPROVED' && (
                    <div className="success-section">
                      <div className="success-icon">🎉</div>
                      <h3>Congratulations!</h3>
                      <p>You have been cleared by all departments for graduation.</p>
                      <button className="primary-btn">Download Certificate</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Clearance Tab */}
          {activeTab === 'clearance' && (
            <div className="tab-content">
              <h2>My Clearance Status</h2>
              {clearanceStatus ? (
                <div className="clearance-details">
                  <div className="detail-group">
                    <label>Request ID:</label>
                    <span className="detail-value">{clearanceStatus.id}</span>
                  </div>
                  <div className="detail-group">
                    <label>Status:</label>
                    <span
                      className="detail-value"
                      style={{ color: getStatusColor(clearanceStatus.status) }}
                    >
                      {getStatusIcon(clearanceStatus.status)} {clearanceStatus.status}
                    </span>
                  </div>
                  <div className="detail-group">
                    <label>Created:</label>
                    <span className="detail-value">
                      {new Date(clearanceStatus.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="clearance-progress">
                    <h3>Department Progress</h3>
                    {clearanceStatus.departments?.map((dept, index) => (
                      <div key={dept.id} className="progress-item">
                        <div className="progress-number">{index + 1}</div>
                        <div className="progress-content">
                          <h4>{dept.name}</h4>
                          <p className="progress-status">{dept.status}</p>
                        </div>
                        <div className="progress-icon">
                          {getStatusIcon(dept.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="no-data">No clearance request submitted yet.</p>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="tab-content">
              <h2>Notifications</h2>
              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="notification-item">
                      <div className="notif-icon">📧</div>
                      <div className="notif-content">
                        <h4>{notif.subject}</h4>
                        <p>{notif.message}</p>
                        <span className="notif-date">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No new notifications</p>
              )}
            </div>
          )}

          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="tab-content">
              <h2>Help & FAQ</h2>
              <div className="faq-section">
                <div className="faq-item">
                  <h4>How do I start my clearance process?</h4>
                  <p>
                    Click on "My Clearance" tab and then click "Submit Clearance Request" button.
                    This will notify all departments about your graduation clearance request.
                  </p>
                </div>
                <div className="faq-item">
                  <h4>How long does the clearance process take?</h4>
                  <p>
                    Typically, each department takes 2-3 business days to review your request.
                    The total process usually takes 1-2 weeks.
                  </p>
                </div>
                <div className="faq-item">
                  <h4>What if a department rejects my clearance?</h4>
                  <p>
                    You'll receive a notification with the reason for rejection.
                    Fix the issue and resubmit your request through the system.
                  </p>
                </div>
                <div className="faq-item">
                  <h4>Can I contact a department officer?</h4>
                  <p>
                    Yes, each department's contact information is available in the department details.
                    You can also view their comments on your clearance status.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
