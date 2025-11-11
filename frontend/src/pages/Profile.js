import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const [language, setLanguage] = useState(currentUser?.language || 'english');

  return (
    <div className="dashboard">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1>Your Hero Profile 🦸‍♂️</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{currentUser?.username}</div>
          <div>Hero Name</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">Level {currentUser?.level}</div>
          <div>Current Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{currentUser?.experience}</div>
          <div>Total XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{currentUser?.streak} days</div>
          <div>Current Streak</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Account Settings</h3>
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={currentUser?.email || ''}
            readOnly
            style={{ background: '#f1f5f9' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Language</label>
          <select 
            className="form-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="kannada">Kannada</option>
            <option value="tamil">Tamil</option>
            <option value="telugu">Telugu</option>
          </select>
        </div>

        <button className="btn btn-primary">
          Save Changes
        </button>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Your Progress</h3>
        <p>Keep going hero! Every day you stay substance-free is a victory.</p>
        
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Next Level Progress</span>
            <span>{currentUser?.level * 200 - currentUser?.experience} XP needed</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(currentUser?.experience / (currentUser?.level * 200)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;