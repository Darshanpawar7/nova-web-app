import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { progress } = useGame();

  const modules = [
    {
      title: "Continue Story",
      description: "Resume your adventure in 'The Echoes of Nova'",
      icon: "📖",
      path: "/story",
      color: "#6366f1"
    },
    {
      title: "Take a Quiz",
      description: "Test your knowledge and earn XP",
      icon: "🧠",
      path: "/quiz",
      color: "#10b981"
    },
    {
      title: "Habit Tracker",
      description: "Track your substance-free days",
      icon: "📊",
      path: "/habits",
      color: "#f59e0b"
    },
    {
      title: "Leaderboard",
      description: "See how you rank among other heroes",
      icon: "🏆",
      path: "/leaderboard",
      color: "#ef4444"
    }
  ];

  return (
    <div className="dashboard">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1>Welcome back, {currentUser?.username}! 👋</h1>
        <p>Continue your journey to become a substance-free hero.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">Level {currentUser?.level}</div>
          <div>Current Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{currentUser?.experience} XP</div>
          <div>Experience Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{currentUser?.streak} days</div>
          <div>Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {progress?.completedChapters?.length || 0}/12
          </div>
          <div>Chapters Completed</div>
        </div>
      </div>

      <div className="progress-section" style={{ marginBottom: '2rem' }}>
        <h3>Progress to Next Level</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${(currentUser?.experience / (currentUser?.level * 200)) * 100}%` 
            }}
          ></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Level {currentUser?.level}</span>
          <span>{currentUser?.level * 200 - currentUser?.experience} XP to Level {currentUser?.level + 1}</span>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Learning Modules</h2>
      <div className="modules-grid">
        {modules.map((module, index) => (
          <Link 
            key={index} 
            to={module.path} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="module-card">
              <div className="module-icon" style={{ fontSize: '4rem' }}>
                {module.icon}
              </div>
              <h3 style={{ color: module.color, marginBottom: '1rem' }}>
                {module.title}
              </h3>
              <p>{module.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {progress?.achievements && progress.achievements.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Your Achievements 🏅</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {progress.achievements.map((achievement, index) => (
              <div 
                key={index}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}
              >
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;