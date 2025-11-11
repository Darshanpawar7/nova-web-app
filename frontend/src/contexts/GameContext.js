import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const GameContext = createContext();

export const useGame = () => {
  return useContext(GameContext);
};

export const GameProvider = ({ children }) => {
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
    fetchLeaderboard();
    fetchQuizzes();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(response.data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaderboard');
      setLeaderboard(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/quizzes');
      setQuizzes(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
      setLoading(false);
    }
  };

  const updateProgress = async (updateData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/progress', updateData);
      setProgress(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const submitQuiz = async (quizId, answers) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/quizzes/${quizId}/attempt`, { answers });
      await fetchProgress(); // Refresh progress to update XP
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const value = {
    progress,
    leaderboard,
    quizzes,
    loading,
    updateProgress,
    submitQuiz,
    refreshData: () => {
      fetchProgress();
      fetchLeaderboard();
      fetchQuizzes();
    }
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};