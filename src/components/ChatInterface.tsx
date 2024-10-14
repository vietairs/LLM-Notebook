import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  citations: number;
}

interface ChatInterfaceProps {
  selectedNote: Note | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedNote }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const updatedHistory = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          chatHistory: updatedHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      setChatHistory([...updatedHistory, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory([...updatedHistory, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedNote ? (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">{selectedNote.title}</h2>
            <p className="text-gray-300">{selectedNote.content}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a note to start chatting
          </div>
        )}
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center">
            <div className="inline-block p-3 rounded-lg bg-gray-700">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2">
          <MessageSquare className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about your document..."
            className="flex-1 bg-transparent outline-none text-white"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            className="text-blue-500 hover:text-blue-600"
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          NotebookAI may still sometimes give inaccurate responses, so you may want to confirm any facts independently.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;