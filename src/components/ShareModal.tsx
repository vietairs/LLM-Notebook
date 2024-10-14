import React from 'react';
import { X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Share Your Notes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="share-link" className="block text-sm font-medium text-gray-300 mb-2">
            Share Link
          </label>
          <input
            type="text"
            id="share-link"
            value="https://notebookai.com/share/abc123"
            readOnly
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => {
            navigator.clipboard.writeText("https://notebookai.com/share/abc123");
            alert("Link copied to clipboard!");
          }}
        >
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default ShareModal;