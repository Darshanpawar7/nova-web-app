import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        🌟 NOVA
      </Link>
      
      <div className="nav-links">
        {currentUser ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/story" className="nav-link">Story</Link>
            <Link to="/quiz" className="nav-link">Quiz</Link>
            <Link to="/habits" className="nav-link">Habits</Link>
            <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="btn btn-primary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;