
import React, { useState, useMemo } from 'react';
import { Workspace, Page } from '../types';
import { ICONS } from '../constants';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  onRestore: (pageId: string) => void;
  onPermanentDelete: (pageId: string) => void;
}

const TrashModal: React.FC<TrashModalProps> = ({ isOpen, onClose, workspaces, onRestore, onPermanentDelete }) => {
  const [query, setQuery] = useState('');

  const deletedPages = useMemo(() => {
    const pages: { workspaceName: string; page: Page }[] = [];
    workspaces.forEach(ws => {
      ws.pages.forEach(p => {
        if (p.isDeleted && p.title.toLowerCase().includes(query.toLowerCase())) {
          pages.push({ workspaceName: ws.name, page: p });
        }
      });
    });
    return pages;
  }, [workspaces, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#252525] w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-[#373737] overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#373737] flex items-center gap-3">
          <div className="text-gray-400"><ICONS.Trash /></div>
          <input 
            autoFocus
            type="text"
            placeholder="Search deleted pages..."
            className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white dark:placeholder:text-gray-500"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {deletedPages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center opacity-30">
              <div className="mb-2 scale-150"><ICONS.Trash /></div>
              <p className="text-sm">Trash is empty</p>
            </div>
          ) : (
            <div className="space-y-1">
              {deletedPages.map(({ workspaceName, page }) => (
                <div key={page.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-[#2f2f2f] rounded-lg group transition-colors">
                  <div className="text-lg w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#373737] rounded">
                    {page.icon || '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate dark:text-gray-200">{page.title || 'Untitled'}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">{workspaceName}</div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onRestore(page.id)}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs font-bold"
                    >
                      Restore
                    </button>
                    <button 
                      onClick={() => onPermanentDelete(page.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded"
                    >
                      <ICONS.Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-[#1f1f1f] border-t border-gray-100 dark:border-[#373737] text-[10px] text-gray-400 flex justify-between items-center">
          <span>Deleted items stay here forever.</span>
          {deletedPages.length > 0 && (
            <button 
              onClick={() => deletedPages.forEach(dp => onPermanentDelete(dp.page.id))}
              className="text-red-500 font-bold hover:underline"
            >
              Empty Trash
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashModal;
