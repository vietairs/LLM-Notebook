import React from 'react';
import { Plus } from 'lucide-react';
import Note from './Note';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  addNote: () => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: number) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNote,
  setSelectedNote,
  addNote,
  updateNote,
  deleteNote
}) => {
  return (
    <div className="w-1/3 bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <button
          className="text-blue-500 flex items-center space-x-2"
          onClick={addNote}
        >
          <Plus className="h-4 w-4" />
          <span>Add note</span>
        </button>
      </div>
      <ul>
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            isSelected={selectedNote?.id === note.id}
            onClick={() => setSelectedNote(note)}
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        ))}
      </ul>
    </div>
  );
};

export default NoteList;