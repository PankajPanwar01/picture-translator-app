import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ImageUploader from './components/ImageUploader';
import TranslationResult from './components/TranslationResult';
import TodoList from './components/TodoList';
import HistoryPanel from './components/HistoryPanel';
import { Languages, Sparkles, Sun, Moon } from 'lucide-react';


const API_URL = "https://picture-translator-app-1.onrender.com";


const langMap = {
  "Auto Detect": "auto",
  "English": "en",
  "Hindi": "hi",
  "French": "fr",
  "Spanish": "es",
  "German": "de",
  "Chinese": "zh",
  "Japanese": "ja",
  "Korean": "ko",
  "Russian": "ru",
  "Arabic": "ar"
};

const languages = Object.keys(langMap);

function App() {
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('English');
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('translate');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 🔥 UPDATED TRANSLATE FUNCTION
  const handleTranslate = async (file) => {
    if (!file) {
      toast.error("Please upload an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("sourceLanguage", langMap[sourceLang]);
    formData.append("targetLanguage", langMap[targetLang]);

    try {
      const response = await fetch(`${API_URL}/api/translate-image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTranslation({
          original: data.originalText,
          translated: data.translatedText,
          id: data.historyId
        });

        toast.success("Image translated successfully!");
      } else {
        toast.error(data.error || "Translation failed");
      }

    } catch (error) {
      console.error(error);
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-900 text-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">
              AI Picture Translator
            </h1>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {darkMode 
              ? <Sun className="w-5 h-5" /> 
              : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Language Selector */}
        <div className="bg-white/10 p-4 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <div className="flex-1 w-full">
              <label className="text-white/70 text-sm mb-1 block">
                Source Language
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <Languages className="w-6 h-6 text-purple-400" />
            
            <div className="flex-1 w-full">
              <label className="text-white/70 text-sm mb-1 block">
                Target Language
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded"
              >
                {languages
                  .filter(l => l !== 'Auto Detect')
                  .map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['translate', 'history', 'todo'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl ${
                activeTab === tab
                  ? 'bg-purple-500'
                  : 'bg-white/10'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto">
        
        {activeTab === 'translate' && (
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUploader onTranslate={handleTranslate} loading={loading} />
            <TranslationResult translation={translation} loading={loading} />
          </div>
        )}

        {activeTab === 'history' && <HistoryPanel />}
        {activeTab === 'todo' && <TodoList />}
        
      </div>
    </div>
  );
}

export default App;