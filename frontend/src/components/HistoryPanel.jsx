// frontend/src/components/HistoryPanel.jsx
import React, { useState, useEffect } from 'react';
import { History, Clock, Copy, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50 mx-auto" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        Translation History
      </h2>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-white/40 text-center py-8">No translations yet</p>
        ) : (
          history.map(item => (
            <div key={item._id} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleString()}
                </div>
                <button onClick={() => copyToClipboard(item.translatedText)} className="text-white/30 hover:text-white/60">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="mb-2">
                <span className="text-xs text-purple-400">{item.sourceLanguage} → {item.targetLanguage}</span>
                <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.originalText}</p>
              </div>
              <p className="text-white font-medium line-clamp-2">{item.translatedText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryPanel;