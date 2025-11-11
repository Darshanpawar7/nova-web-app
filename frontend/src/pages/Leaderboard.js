import React from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

const Leaderboard = () => {
  const { leaderboard } = useGame();
  const { currentUser } = useAuth();

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1>Hero Leaderboard 🏆</h1>
        <p>See how you rank among other substance-free champions!</p>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((user, index) => (
          <div 
            key={user._id || index}
            className="leaderboard-item"
            style={{
              background: user._id === currentUser?.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '',
              color: user._id === currentUser?.id ? 'white' : 'inherit'
            }}
          >
            <div className="leaderboard-rank">
              {getRankIcon(index + 1)}
            </div>
            
            <div className="leaderboard-user">
              <strong>{user.username}</strong>
              {user._id === currentUser?.id && <span> 👈 You!</span>}
            </div>
            
            <div className="leaderboard-stats">
              <div>Level {user.level}</div>
              <div>{user.experience} XP</div>
              <div>🔥 {user.streak} days</div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="card">
          <p>No heroes on the leaderboard yet. Be the first to complete challenges!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;