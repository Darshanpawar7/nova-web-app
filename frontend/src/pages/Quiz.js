import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';

const Quiz = () => {
  const { quizzes, submitQuiz } = useGame();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = (quiz) => {
    if (quiz && quiz.questions) {
      setCurrentQuiz(quiz);
      setCurrentQuestion(0);
      setAnswers([]);
      setShowResults(false);
      setResults(null);
    }
  };

  const handleAnswer = async (answerIndex) => {
    if (!currentQuiz || !currentQuiz.questions) return;

    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      setLoading(true);
      const result = await submitQuiz(currentQuiz._id, newAnswers);
      setLoading(false);
      
      if (result.success) {
        setResults(result.data);
        setShowResults(true);
      }
    }
  };

  // Reset when quizzes load
  useEffect(() => {
    if (quizzes.length > 0 && !currentQuiz) {
      setCurrentQuiz(null);
    }
  }, [quizzes, currentQuiz]);

  if (showResults && results) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Quiz Complete! 🎉</h2>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {results.percentage >= 70 ? '🏆' : results.percentage >= 50 ? '👍' : '💪'}
            </div>
            <h3>Score: {results.score}/{results.total}</h3>
            <p>{Math.round(results.percentage)}% Correct</p>
            <p>+{results.score * 20} XP Earned!</p>
          </div>

          {currentQuiz && (
            <div style={{ marginTop: '2rem' }}>
              <h4>Review Answers:</h4>
              {results.results.map((result, index) => (
                <div key={index} style={{
                  background: result.isCorrect ? '#d1fae5' : '#fee2e2',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '1rem'
                }}>
                  <p><strong>Q: {result.question}</strong></p>
                  <p>Your answer: {currentQuiz.questions[index].options[result.userAnswer]}</p>
                  <p>Correct answer: {currentQuiz.questions[index].options[result.correctAnswer]}</p>
                  <p><em>{result.explanation}</em></p>
                </div>
              ))}
            </div>
          )}

          <button 
            className="btn btn-primary"
            onClick={() => setCurrentQuiz(null)}
            style={{ marginTop: '1rem' }}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (currentQuiz && currentQuiz.questions) {
    const question = currentQuiz.questions[currentQuestion];
    
    if (!question) {
      return (
        <div className="quiz-container">
          <div className="quiz-card">
            <h2>Error Loading Question</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentQuiz(null)}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>{currentQuiz.title}</h2>
          <p>Question {currentQuestion + 1} of {currentQuiz.questions.length}</p>
          
          <div style={{ 
            background: 'var(--light)', 
            padding: '2rem', 
            borderRadius: '15px',
            margin: '2rem 0'
          }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{question.question}</h3>
            
            <div className="quiz-options">
              {question.options && question.options.map((option, index) => (
                <button
                  key={index}
                  className="quiz-option"
                  onClick={() => handleAnswer(index)}
                  disabled={loading}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${((currentQuestion + 1) / currentQuiz.questions.length) * 100}%` 
              }}
            ></div>
          </div>
          
          {loading && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p>Submitting your answers...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1>Knowledge Challenges 🧠</h1>
        <p>Test your understanding and earn experience points!</p>
      </div>

      <div className="modules-grid">
        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <div 
              key={quiz._id || index}
              className="module-card"
              onClick={() => startQuiz(quiz)}
            >
              <div className="module-icon">📝</div>
              <h3>{quiz.title || 'Untitled Quiz'}</h3>
              <p>{quiz.questions ? quiz.questions.length : 0} questions</p>
              <p>Difficulty: {quiz.difficulty || 'Unknown'}</p>
              <p>Category: {quiz.category || 'General'}</p>
            </div>
          ))
        ) : (
          <div className="card">
            <h3>No Quizzes Available</h3>
            <p>Make sure your backend is running and sample data is loaded.</p>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>To add sample data:</strong></p>
              <ol style={{ textAlign: 'left', marginLeft: '2rem' }}>
                <li>Ensure backend is running on https://nova-web-app-aqho.onrender.com</li>
                <li>Visit: https://nova-web-app-aqho.onrender.com/api/seed-data</li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem' }}
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;