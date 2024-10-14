import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('medium');
  const [model, setModel] = useState('openai');

  useEffect(() => {
    // Load settings from localStorage or use defaults
    setTheme(localStorage.getItem('theme') || 'dark');
    setFontSize(localStorage.getItem('fontSize') || 'medium');
    setModel(localStorage.getItem('model') || 'openai');
  }, []);

  const saveSettings = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('model', model);

    // Send model change to backend
    fetch('http://localhost:8000/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    }).catch(error => console.error('Error updating settings:', error));

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-2">
            Theme
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="font-size" className="block text-sm font-medium text-gray-300 mb-2">
            Font Size
          </label>
          <select
            id="font-size"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
            AI Model
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI</option>
            <option value="lmstudio">LM Studio</option>
          </select>
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={saveSettings}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;