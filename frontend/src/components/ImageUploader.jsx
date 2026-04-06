// frontend/src/components/ImageUploader.jsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X, Loader2, Languages } from "lucide-react";

function ImageUploader({ onTranslate, loading }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp']
    },
    maxFiles: 1
  });

  const clearImage = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleTranslate = () => {
    if (selectedFile) {
      onTranslate(selectedFile);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Image className="w-5 h-5" />
        Upload Image
      </h2>
      
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-purple-400 bg-purple-500/20' : 'border-white/30 hover:border-purple-400'}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-white/50 mx-auto mb-3" />
          <p className="text-white/70">
            {isDragActive ? 'Drop your image here' : 'Drag & drop or click to select'}
          </p>
          <p className="text-white/40 text-sm mt-2">PNG, JPG, WEBP up to 10MB</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full rounded-xl max-h-64 object-contain bg-black/30" />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-red-500 transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white 
              hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="w-5 h-5" />
                Translate Image
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;