import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix for ENOTFOUND on local machines
// Fix for ENOTFOUND on local machines - removed as direct connection is now used

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4, // Force IPv4 to avoid common DNS/timeout issues
  connectTimeoutMS: 30000
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// User Model with Performance Tracking
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  grade: { type: String, default: 'Class 10' },
  board: { type: String, default: 'CBSE' },
  interests: { type: [String], default: ['Mathematics', 'Science'] },
  performance: {
    topicsCompleted: { type: Number, default: 0 },
    testsAttempted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now }
  }
});

const User = mongoose.model('User', UserSchema);

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, grade, board } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword, grade, board });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, forceLogin } = req.body;
    let user = await User.findOne({ email });
    
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'password123', salt);
      user = new User({
        name: email.split('@')[0],
        email,
        password: hashedPassword,
        grade: 'Class 10',
        board: 'CBSE'
      });
      await user.save();
    } else if (!forceLogin) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials. If you forgot your password, try the Emergency Login button.' });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update Performance
app.post('/api/user/performance', async (req, res) => {
  try {
    const { email, performance } = req.body;
    const user = await User.findOneAndUpdate({ email }, { performance }, { new: true });
    res.json({ success: true, performance: user.performance });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// NCERT Search
app.post('/api/ncert-search', async (req, res) => {
  const { query, subject } = req.body;
  try {
    const prompt = `You are an NCERT 10th Expert. Provide a detailed step-by-step solution for: "${query}" in subject: "${subject}". 
    Format the response clearly with Question, Concept, Steps, and Final Answer. Use markdown.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return res.json({ 
      success: true, 
      data: {
        question: query,
        steps: text.split('\n').filter(line => line.trim() !== ''),
        answer: "See steps above"
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI generation failed." });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Edu Spark Backend is Live!', db: mongoose.connection.readyState === 1 });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Edu Spark is running on http://localhost:${PORT}`);
});
