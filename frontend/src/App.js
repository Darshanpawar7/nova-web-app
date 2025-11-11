import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Story from './pages/Story';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import HabitTracker from './pages/HabitTracker';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/story" element={<Story />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/habits" element={<HabitTracker />} />
              </Routes>
            </main>
          </div>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;