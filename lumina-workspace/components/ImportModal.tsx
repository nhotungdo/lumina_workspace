
import React, { useRef, useState } from 'react';
import { ICONS } from '../constants';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: string, type: 'md' | 'csv') => void;
  onGoogleDocImport: () => void;
  onNotionImport: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, onGoogleDocImport, onNotionImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    const type = file.name.endsWith('.csv') ? 'csv' : 'md';
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onImport(text, type);
      onClose();
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#252525] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-[#373737]"
        onClick={e => e.stopPropagation()}
      >
        <header className="px-6 py-4 border-b border-gray-100 dark:border-[#373737] flex justify-between items-center">
          <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
            <ICONS.FileUp /> Import Content
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </header>

        <div className="p-6 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); }}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-[#373737] hover:border-blue-400'}`}
          >
            <div className="text-blue-500 flex justify-center scale-150 mb-4"><ICONS.FileUp /></div>
            <p className="text-sm font-medium dark:text-gray-200">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">Markdown (.md) or CSV (.csv)</p>
            <input type="file" ref={fileInputRef} className="hidden" accept=".md,.csv" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onGoogleDocImport}
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-[#373737] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2f2f2f] transition-colors"
            >
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">G</div>
              <div className="text-left">
                <div className="text-xs font-bold dark:text-white">Google Docs</div>
                <div className="text-[10px] text-gray-500">Import files from Drive</div>
              </div>
            </button>
            <button 
              onClick={onNotionImport}
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-[#373737] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2f2f2f] transition-colors"
            >
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-900 font-bold">N</div>
              <div className="text-left">
                <div className="text-xs font-bold dark:text-white">Notion</div>
                <div className="text-[10px] text-gray-500">Sync pages and data</div>
              </div>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 dark:bg-[#1f1f1f] text-[10px] text-gray-400 border-t dark:border-[#373737]">
          We'll convert your external documents into Lumina blocks automatically.
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
