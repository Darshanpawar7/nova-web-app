const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nova', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default-avatar.png' },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date },
  language: { type: String, default: 'english' },
  createdAt: { type: Date, default: Date.now }
});

// Story Progress Schema
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chapter: { type: Number, default: 1 },
  completedChapters: [{ type: Number }],
  choices: { type: Map, of: String },
  achievements: [{ type: String }]
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  category: String,
  difficulty: String,
  language: { type: String, default: 'english' }
});

const User = mongoose.model('User', userSchema);
const Progress = mongoose.model('Progress', progressSchema);
const Quiz = mongoose.model('Quiz', quizSchema);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'nova_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const progress = new Progress({ userId: user._id });
    await progress.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'nova_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        experience: user.experience,
        streak: user.streak
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update streak
    const today = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    
    if (lastLogin) {
      const diffTime = Math.abs(today - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    
    user.lastLogin = today;
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'nova_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        experience: user.experience,
        streak: user.streak
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user progress
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.userId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress
app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { chapter, choices, achievement } = req.body;
    const progress = await Progress.findOne({ userId: req.user.userId });
    
    if (chapter && !progress.completedChapters.includes(chapter)) {
      progress.completedChapters.push(chapter);
      
      // Add experience points
      const user = await User.findById(req.user.userId);
      user.experience += 100;
      
      // Level up logic
      const expNeeded = user.level * 200;
      if (user.experience >= expNeeded) {
        user.level += 1;
        user.experience = user.experience - expNeeded;
      }
      
      await user.save();
    }
    
    if (choices) {
      progress.choices = new Map([...progress.choices, ...choices]);
    }
    
    if (achievement && !progress.achievements.includes(achievement)) {
      progress.achievements.push(achievement);
    }
    
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const { category, language } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (language) filter.language = language;
    
    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz attempt
app.post('/api/quizzes/:id/attempt', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const { answers } = req.body;
    
    let score = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) score++;
      return {
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    // Add experience based on score
    const user = await User.findById(req.user.userId);
    user.experience += score * 20;
    
    const expNeeded = user.level * 200;
    if (user.experience >= expNeeded) {
      user.level += 1;
      user.experience = user.experience - expNeeded;
    }
    
    await user.save();

    res.json({
      score,
      total: quiz.questions.length,
      percentage: (score / quiz.questions.length) * 100,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find({}, 'username level experience streak avatar')
      .sort({ level: -1, experience: -1 })
      .limit(20);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { username, language } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (username) user.username = username;
    if (language) user.language = language;
    
    await user.save();
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      level: user.level,
      experience: user.experience,
      streak: user.streak,
      language: user.language
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add sample data endpoint for testing (GET and POST)
app.get('/api/seed-data', async (req, res) => {
  try {
    await addSampleData();
    res.json({ message: 'Sample data added successfully via GET!' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding sample data' });
  }
});

app.post('/api/seed-data', async (req, res) => {
  try {
    await addSampleData();
    res.json({ message: 'Sample data added successfully via POST!' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding sample data' });
  }
});

// Function to add sample data
async function addSampleData() {
  // Clear existing quizzes
  await Quiz.deleteMany({});
  
  // Add sample quizzes
  const sampleQuizzes = [
    {
      title: "Substance Abuse Basics",
      category: "Education",
      difficulty: "Beginner",
      language: "english",
      questions: [
        {
          question: "What is the most common reason adolescents start using substances?",
          options: [
            "Peer pressure",
            "Academic stress", 
            "Family problems",
            "Curiosity"
          ],
          correctAnswer: 0,
          explanation: "Peer pressure is the most common factor, where young people feel compelled to fit in with their social group."
        },
        {
          question: "Which substance is most commonly abused by Indian youth?",
          options: [
            "Tobacco",
            "Alcohol",
            "Marijuana",
            "Prescription drugs"
          ],
          correctAnswer: 0,
          explanation: "Tobacco, in forms like cigarettes and gutka, is the most commonly abused substance among Indian youth."
        },
        {
          question: "What is a healthy alternative to cope with stress instead of substance use?",
          options: [
            "Exercise and sports",
            "Talking to friends or counselors",
            "Meditation and yoga",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "All these are healthy alternatives that help manage stress without harmful consequences."
        }
      ]
    },
    {
      title: "Peer Pressure Resistance",
      category: "Skills",
      difficulty: "Intermediate",
      language: "english",
      questions: [
        {
          question: "What's the best way to say 'no' to substance offers?",
          options: [
            "Be assertive and direct",
            "Make excuses and leave",
            "Give in to avoid conflict",
            "Ignore the person"
          ],
          correctAnswer: 0,
          explanation: "Being assertive and direct is the most effective way to communicate your boundaries clearly."
        },
        {
          question: "True friends will:",
          options: [
            "Respect your decision to stay substance-free",
            "Pressure you to try substances",
            "Make fun of your choices",
            "Exclude you for not participating"
          ],
          correctAnswer: 0,
          explanation: "True friends respect your decisions and values, including your choice to stay substance-free."
        }
      ]
    }
  ];

  await Quiz.insertMany(sampleQuizzes);
  console.log('Sample quizzes added!');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NOVA Server running on port ${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
  console.log(`🌱 Add sample data: http://localhost:${PORT}/api/seed-data`);
});