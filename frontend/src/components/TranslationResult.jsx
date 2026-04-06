import React from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

function TranslationResult({ translation, loading }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!translation?.translated) return;
    navigator.clipboard.writeText(translation.translated);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-white min-h-[300px]">
      
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        ✨ Translated Result
      </h2>

      {loading ? (
        <p className="text-gray-300 animate-pulse">Translating...</p>
      ) : translation?.translated ? (
        <div className="relative">
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-white/10 p-2 rounded-lg hover:bg-white/20"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>

          {/* Translated Text */}
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {translation.translated}
          </p>

        </div>
      ) : (
        <p className="text-gray-400">
          Upload an image to see translation
        </p>
      )}
    </div>
  );
}

export default TranslationResult;