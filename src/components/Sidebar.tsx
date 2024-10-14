import React, { useState } from 'react';
import { Upload, Plus, CheckSquare, Trash2 } from 'lucide-react';
import FileUploadModal from './FileUploadModal';

interface SidebarProps {
  selectedSource: string | null;
  setSelectedSource: (source: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sources, setSources] = useState([
    { id: 'diego-thesis', name: 'Diego Thesis.pdf' }
  ]);

  const handleFileUpload = (file: File, result: string) => {
    console.log('File processed:', file.name);
    console.log('Processing result:', result);
    
    // Add the new source to the list
    setSources([...sources, { id: file.name, name: file.name }]);
    
    // TODO: Store the processing result for later use (e.g., in a state or context)
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };

  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Sources</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4 flex items-center justify-center space-x-2"
        onClick={() => setIsModalOpen(true)}
      >
        <Upload className="h-4 w-4" />
        <span>Upload file</span>
      </button>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">Select all sources</span>
        <CheckSquare className="h-4 w-4 text-gray-400 cursor-pointer" />
      </div>
      <ul className="space-y-2 flex-1 overflow-y-auto">
        {sources.map((source) => (
          <li key={source.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
            <span className="text-white">{source.name}</span>
            <button onClick={() => handleDelete(source.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <FileUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </aside>
  );
};

export default Sidebar;