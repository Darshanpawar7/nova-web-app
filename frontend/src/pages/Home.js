import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to NOVA</h1>
        <p>Your journey to a substance-free life starts here. Learn, play, and grow with our gamified platform.</p>
        {!currentUser ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary pulse" style={{ padding: '15px 30px', fontSize: '1.2rem' }}>
              Start Your Journey
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '15px 30px', fontSize: '1.2rem' }}>
              Returning Hero
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="btn btn-primary pulse" style={{ padding: '15px 30px', fontSize: '1.2rem' }}>
            Continue Adventure
          </Link>
        )}
      </section>

      <section className="features">
        <div className="feature-card floating">
          <div className="feature-icon">📚</div>
          <h3>Interactive Story</h3>
          <p>Embark on an epic journey through "The Echoes of Nova" and learn through immersive storytelling.</p>
        </div>
        
        <div className="feature-card floating" style={{ animationDelay: '0.5s' }}>
          <div className="feature-icon">🧠</div>
          <h3>Brain Training</h3>
          <p>Challenge yourself with quizzes and puzzles that reinforce healthy decision-making skills.</p>
        </div>
        
        <div className="feature-card floating" style={{ animationDelay: '1s' }}>
          <div className="feature-icon">🏆</div>
          <h3>Earn Rewards</h3>
          <p>Level up, earn achievements, and climb the leaderboard as you progress in your journey.</p>
        </div>
        
        <div className="feature-card floating" style={{ animationDelay: '1.5s' }}>
          <div className="feature-icon">📱</div>
          <h3>Track Progress</h3>
          <p>Monitor your substance-free streak and build healthy habits with our tracking system.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;