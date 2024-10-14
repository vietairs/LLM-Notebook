import React, { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

interface NoteProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (note: Note) => void;
  onDelete: (id: number) => void;
}

const Note: React.FC<NoteProps> = ({ note, isSelected, onClick, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (editedTitle.trim() !== note.title) {
      onUpdate({ ...note, title: editedTitle.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <li
      className={`border-b border-gray-700 p-4 hover:bg-gray-700 cursor-pointer relative ${
        isSelected ? 'bg-gray-700' : ''
      }`}
      onClick={onClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-blue-500 font-semibold outline-none"
        />
      ) : (
        <h3
          className="text-blue-500 font-semibold mb-2 cursor-text"
          onClick={handleTitleClick}
        >
          {note.title}
        </h3>
      )}
      <p className="text-sm text-gray-400 mb-2">{note.content.substring(0, 100)}...</p>
      <span className="text-xs text-gray-500">{note.citations} citations</span>
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
};

export default Note;