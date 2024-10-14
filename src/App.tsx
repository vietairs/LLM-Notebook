import React, { useState } from 'react';
import { Book, Settings, Share, User } from 'lucide-react';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import ChatInterface from './components/ChatInterface';
import ShareModal from './components/ShareModal';
import SettingsModal from './components/SettingsModal';

interface Note {
  id: number;
  title: string;
  content: string;
  citations: number;
}

function App() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      citations: 0
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    setSelectedNote(updatedNote);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar selectedSource={selectedSource} setSelectedSource={setSelectedSource} />
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Book className="h-6 w-6" />
            <h1 className="text-xl font-semibold">NotebookAI</h1>
            <span className="bg-blue-500 text-xs px-2 py-1 rounded">EXPERIMENTAL</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
            <Settings
              className="h-6 w-6 cursor-pointer"
              onClick={() => setIsSettingsModalOpen(true)}
            />
            <User className="h-6 w-6 cursor-pointer" />
          </div>
        </header>
        <main className="flex-1 flex overflow-hidden">
          <NoteList
            notes={notes}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
          />
          <ChatInterface selectedNote={selectedNote} />
        </main>
      </div>
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </div>
  );
}

export default App;