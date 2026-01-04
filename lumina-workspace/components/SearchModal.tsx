
import React, { useState, useMemo } from 'react';
import { Workspace, Page, Block } from '../types';
import { ICONS } from '../constants';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  onSelectPage: (workspaceId: string, pageId: string) => void;
}

interface SearchResult {
  workspaceId: string;
  workspaceName: string;
  page: Page;
  matchedBlock?: Block;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, workspaces, onSelectPage }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    workspaces.forEach(ws => {
      ws.pages.forEach(p => {
        if (p.isDeleted) return;

        // Title match
        if (p.title.toLowerCase().includes(q)) {
          matches.push({ workspaceId: ws.id, workspaceName: ws.name, page: p });
        } 
        
        // Block content match
        p.blocks.forEach(block => {
          if (block.content.toLowerCase().includes(q)) {
            // Avoid adding same page multiple times if title already matched
            if (!matches.some(m => m.page.id === p.id && !m.matchedBlock)) {
              matches.push({ 
                workspaceId: ws.id, 
                workspaceName: ws.name, 
                page: p,
                matchedBlock: block 
              });
            }
          }
        });
      });
    });
    return matches.slice(0, 15); // Limit results for performance
  }, [query, workspaces]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#00000040] backdrop-blur-[2px] z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="text-gray-400">
            <ICONS.Search />
          </div>
          <input 
            autoFocus
            type="text"
            placeholder="Search pages, titles, or content..."
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-gray-400"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            ESC
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {query.trim() === '' ? (
            <div className="p-10 text-center space-y-2">
              <div className="text-gray-300 flex justify-center scale-150 mb-4"><ICONS.Search /></div>
              <p className="text-sm font-medium text-gray-500">Global Search</p>
              <p className="text-xs text-gray-400">Type something to search through pages and blocks.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-gray-400">No results found for <span className="text-gray-900 font-medium">"{query}"</span></p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res, i) => (
                <div 
                  key={`${res.workspaceId}-${res.page.id}-${res.matchedBlock?.id || 'title'}`}
                  onClick={() => {
                    onSelectPage(res.workspaceId, res.page.id);
                    onClose();
                  }}
                  className="flex items-start gap-3 p-2.5 hover:bg-[#efefed] rounded-lg cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                    {res.page.icon || '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-semibold text-gray-900 truncate">{res.page.title || 'Untitled'}</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter bg-gray-50 px-1 rounded">{res.workspaceName}</span>
                    </div>
                    {res.matchedBlock ? (
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        <span className="bg-yellow-100 px-0.5 rounded text-gray-900">...</span>
                        {res.matchedBlock.content}
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate italic">Page Title Match</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="bg-white border rounded px-1">↑↓</span> navigate
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-white border rounded px-1">↵</span> select
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-white border rounded px-1">⌘ + K</span> shortcut
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
