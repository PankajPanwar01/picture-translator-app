
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { translateText } = require('./services/translate');
const { extractTextFromImage } = require('./services/ocr');

require('dotenv').config({ path: __dirname + '/.env' });
const app = express();

// Middleware
const cors = require("cors");

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB error:", err));

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Models
const TranslationHistorySchema = new mongoose.Schema({
  originalText: String,
  translatedText: String,
  sourceLanguage: String,
  targetLanguage: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const TodoItemSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  translationId: { type: mongoose.Schema.Types.ObjectId, ref: 'TranslationHistory' },
  createdAt: { type: Date, default: Date.now }
});

const TranslationHistory = mongoose.model('TranslationHistory', TranslationHistorySchema);
const TodoItem = mongoose.model('TodoItem', TodoItemSchema);

// Routes
app.post('/api/translate-image', upload.single('image'), async (req, res) => {
  try {
    const { sourceLanguage, targetLanguage } = req.body;
    const imagePath = req.file.path;
    
    // Extract text from image
    const extractedText = await extractTextFromImage(imagePath);
    
    // Translate text
    const translatedText = await translateText(extractedText, sourceLanguage, targetLanguage);
    
    // Save to history
    const history = new TranslationHistory({
      originalText: extractedText,
      translatedText,
      sourceLanguage,
      targetLanguage,
      imageUrl: imagePath
    });
    await history.save();
    
    res.json({
      success: true,
      originalText: extractedText,
      translatedText,
      historyId: history._id
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await TranslationHistory.find().sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { text, translationId } = req.body;
    const todo = new TodoItem({ text, translationId });
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await TodoItem.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { completed } = req.body;
    const todo = await TodoItem.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await TodoItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));