import React, { useState } from 'react';

const HabitTracker = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Substance-Free Day', completed: true },
    { id: 2, name: '15min Exercise', completed: false },
    { id: 3, name: 'Healthy Eating', completed: true },
    { id: 4, name: 'Positive Social Activity', completed: false },
  ]);

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="dashboard">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1>Healthy Habits Tracker 📊</h1>
        <p>Build positive routines and track your substance-free journey</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{completedCount}/{habits.length}</div>
          <div>Today's Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">7 days</div>
          <div>Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">85%</div>
          <div>Success Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24</div>
          <div>Total Substance-Free Days</div>
        </div>
      </div>

      <div className="card">
        <h3>Today's Healthy Habits</h3>
        <p>Complete these daily activities to build resilience:</p>
        
        <div style={{ marginTop: '2rem' }}>
          {habits.map(habit => (
            <div 
              key={habit.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: habit.completed ? '#d1fae5' : '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => toggleHabit(habit.id)}
            >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                border: '2px solid #10b981',
                borderRadius: '50%',
                marginRight: '1rem',
                background: habit.completed ? '#10b981' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px'
              }}>
                {habit.completed && '✓'}
              </div>
              <span style={{ 
                textDecoration: habit.completed ? 'line-through' : 'none',
                opacity: habit.completed ? 0.7 : 1
              }}>
                {habit.name}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '10px' }}>
          <h4>🎯 Daily Motivation</h4>
          <p>"Every substance-free day makes you stronger. You're building a healthier future with each positive choice!"</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Weekly Progress</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} style={{ textAlign: 'center' }}>
              <div>{day}</div>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                background: '#10b981', 
                borderRadius: '50%',
                margin: '0.5rem auto',
                opacity: Math.random() > 0.3 ? 1 : 0.3
              }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;