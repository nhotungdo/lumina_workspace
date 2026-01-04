
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import BlockEditor from './components/BlockEditor';
import PermissionsDialog from './components/PermissionsDialog';
import SearchModal from './components/SearchModal';
import SettingsModal from './components/SettingsModal';
import TrashModal from './components/TrashModal';
import CommentPanel from './components/CommentPanel';
import ImportModal from './components/ImportModal';
import { Workspace, Page, Block, BlockType, PermissionRole, Comment, Notification, WorkspaceMember, Cursor, Presence, UserSettings } from './types';
import { INITIAL_DATA, ICONS } from './constants';
import { exportToMarkdown, exportToHTML, importFromMarkdown, downloadFile } from './services/importExportService';

const App: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_DATA);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(INITIAL_DATA[0].id);
  const [activePageId, setActivePageId] = useState<string>(INITIAL_DATA[0].pages[0].id);
  
  // History State
  const [history, setHistory] = useState<Block[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Customization State
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    fontStyle: 'sans',
    language: 'en',
    timezone: 'UTC+7'
  });

  // Collaborative State
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<Cursor[]>([]);
  const [remotePresence, setRemotePresence] = useState<Presence[]>([]);
  const [remoteUpdates, setRemoteUpdates] = useState<Record<string, number>>({});
  
  // UI State
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [activeCommentContext, setActiveCommentContext] = useState<{ isOpen: boolean; blockId?: string } | null>(null);

  const activeWorkspace = useMemo(() => workspaces.find(ws => ws.id === activeWorkspaceId) || workspaces[0], [workspaces, activeWorkspaceId]);
  const activePage = useMemo(() => activeWorkspace.pages.find(p => p.id === activePageId) || activeWorkspace.pages[0], [activeWorkspace, activePageId]);
  const currentUser = activeWorkspace.members[0];

  // Apply Settings Effect
  useEffect(() => {
    if (settings.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    const root = document.getElementById('root');
    if (root) root.className = `font-${settings.fontStyle}`;
  }, [settings]);

  // Keyboard Shortcuts (Undo/Redo, Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevBlocks = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      applyBlocks(prevBlocks, false);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextBlocks = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      applyBlocks(nextBlocks, false);
    }
  };

  const applyBlocks = (newBlocks: Block[], pushToHistory = true) => {
    if (pushToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newBlocks);
      if (newHistory.length > 50) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    setWorkspaces(prevWorkspaces => prevWorkspaces.map(ws => 
      ws.id === activeWorkspaceId ? {
        ...ws,
        pages: ws.pages.map(p => p.id === activePageId ? { ...p, blocks: newBlocks, lastModified: Date.now() } : p)
      } : ws
    ));
  };

  // Real-time Simulation
  useEffect(() => {
    if (activeWorkspace.members.length < 2) return;
    const interval = setInterval(() => {
      const otherMembers = activeWorkspace.members.filter(m => m.id !== currentUser.id);
      if (otherMembers.length === 0) return;
      const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
      const randomBlock = activePage.blocks[Math.floor(Math.random() * activePage.blocks.length)];
      if (!randomBlock) return;
      
      const newCursor: Cursor = {
        userId: randomMember.id,
        userName: randomMember.name,
        color: randomMember.color || '#3b82f6',
        blockId: randomBlock.id,
        lastUpdate: Date.now()
      };
      setRemoteCursors(prev => {
        const filtered = prev.filter(c => c.userId !== randomMember.id);
        return [...filtered, newCursor];
      });
      if (Math.random() > 0.8) setRemoteUpdates(prev => ({ ...prev, [randomBlock.id]: Date.now() }));
    }, 3000);
    return () => clearInterval(interval);
  }, [activePageId, activeWorkspace.members, currentUser.id, activePage.blocks]);

  // Workspace Handlers
  const handleAddWorkspace = () => {
    const newWsId = `ws-${Date.now()}`;
    const newWorkspace: Workspace = {
      id: newWsId,
      name: 'New Workspace',
      icon: '📁',
      members: [currentUser],
      pages: [{
        id: `p-${Date.now()}`,
        title: 'Getting Started',
        icon: '👋',
        lastModified: Date.now(),
        blocks: [{ id: `b-${Date.now()}`, type: BlockType.TEXT, content: 'Welcome to your new workspace!' }]
      }]
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(newWsId);
    setActivePageId(newWorkspace.pages[0].id);
  };

  const handleUpdateWorkspace = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => prev.map(ws => ws.id === id ? { ...ws, ...updates } : ws));
  };

  const handleDeleteWorkspace = (id: string) => {
    const remaining = workspaces.filter(ws => ws.id !== id);
    if (remaining.length === 0) {
      // Just reset to default if deleting last one
      setWorkspaces(INITIAL_DATA);
      setActiveWorkspaceId(INITIAL_DATA[0].id);
      setActivePageId(INITIAL_DATA[0].pages[0].id);
    } else {
      setWorkspaces(remaining);
      setActiveWorkspaceId(remaining[0].id);
      setActivePageId(remaining[0].pages[0].id);
    }
  };

  const handleInviteMember = (email: string) => {
    const newMember: WorkspaceMember = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: PermissionRole.EDITOR,
      avatar: `https://picsum.photos/seed/${email}/40/40`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    handleUpdateWorkspace(activeWorkspaceId, { members: [...activeWorkspace.members, newMember] });
  };

  const handleUpdatePageBlocks = (newBlocks: Block[]) => {
    applyBlocks(newBlocks);
  };

  const handleAddPage = () => {
    const newPage: Page = { id: `p-${Date.now()}`, title: 'Untitled', icon: '', lastModified: Date.now(), blocks: [{ id: `b-${Date.now()}`, type: BlockType.TEXT, content: '' }] };
    setWorkspaces(prev => prev.map(ws => ws.id === activeWorkspaceId ? { ...ws, pages: [...ws.pages, newPage] } : ws));
    setActivePageId(newPage.id);
  };

  const handleSearchNavigate = (workspaceId: string, pageId: string) => {
    setActiveWorkspaceId(workspaceId);
    setActivePageId(pageId);
  };

  const isReadOnly = activeWorkspace.members.find(m => m.id === currentUser.id)?.role === PermissionRole.VIEWER;

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#dfdfde] transition-colors">
      <Sidebar 
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        activePageId={activePageId}
        onSelectWorkspace={setActiveWorkspaceId}
        onSelectPage={setActivePageId}
        onAddPage={handleAddPage}
        onAddWorkspace={handleAddWorkspace} 
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTrash={() => setIsTrashOpen(true)}
        onOpenInbox={() => {}}
        trashCount={workspaces.reduce((acc, ws) => acc + ws.pages.filter(p => p.isDeleted).length, 0)}
        unreadNotificationsCount={0}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative bg-white dark:bg-[#191919]">
        <header className="sticky top-0 bg-white/90 dark:bg-[#191919]/90 backdrop-blur-md z-40 px-4 h-11 flex items-center justify-between border-b border-gray-100 dark:border-[#373737] transition-all no-print">
          <div className="flex items-center gap-1 overflow-hidden">
             <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded cursor-pointer transition-colors group">
                <span className="text-sm">{activeWorkspace.icon}</span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{activeWorkspace.name}</span>
             </div>
             <div className="text-gray-300 dark:text-gray-700 mx-0.5"><ICONS.ChevronRight /></div>
             <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded cursor-pointer transition-colors max-w-[200px]">
                <span className="text-sm">{activePage?.icon || '📄'}</span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{activePage?.title || 'Untitled'}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-[#2f2f2f] rounded text-[10px] font-bold text-gray-400">
               <button onClick={handleUndo} disabled={historyIndex <= 0} className="hover:text-blue-500 disabled:opacity-30">UNDO</button>
               <span>/</span>
               <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="hover:text-blue-500 disabled:opacity-30">REDO</button>
            </div>
            <button onClick={() => setIsImportOpen(true)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors"><ICONS.FileUp /></button>
            <button onClick={() => setIsPermissionOpen(true)} className="text-xs font-bold px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded transition-colors text-gray-600 dark:text-gray-400">Share</button>
          </div>
        </header>

        <div className="flex-1">
           <div className="max-w-4xl mx-auto px-12 pt-16 print-content">
              <input 
                type="text"
                value={activePage?.title || ''}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setWorkspaces(prev => prev.map(ws => ws.id === activeWorkspaceId ? { ...ws, pages: ws.pages.map(p => p.id === activePageId ? { ...p, title: newTitle } : p) } : ws));
                }}
                placeholder="Untitled"
                className="w-full text-5xl font-extrabold border-none outline-none placeholder:text-gray-100 dark:placeholder:text-gray-800 bg-transparent dark:text-white"
                readOnly={isReadOnly}
              />
           </div>

           <BlockEditor 
             blocks={activePage?.blocks || []}
             onChange={handleUpdatePageBlocks}
             readOnly={isReadOnly}
             members={activeWorkspace.members}
             onOpenComment={(blockId) => setActiveCommentContext({ isOpen: true, blockId })}
             remoteCursors={remoteCursors}
             remoteUpdates={remoteUpdates}
           />
        </div>

        <PermissionsDialog 
          isOpen={isPermissionOpen} 
          workspace={activeWorkspace} 
          onClose={() => setIsPermissionOpen(false)} 
          onUpdateRole={(mId, role) => handleUpdateWorkspace(activeWorkspaceId, { members: activeWorkspace.members.map(m => m.id === mId ? {...m, role} : m)})} 
          onInvite={handleInviteMember}
        />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} workspaces={workspaces} onSelectPage={handleSearchNavigate} />
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          activeWorkspace={activeWorkspace} 
          settings={settings} 
          onUpdateSettings={(updates) => setSettings(prev => ({ ...prev, ...updates }))} 
          onUpdateWorkspace={handleUpdateWorkspace}
          onDeleteWorkspace={handleDeleteWorkspace}
        />
        <TrashModal 
          isOpen={isTrashOpen} 
          onClose={() => setIsTrashOpen(false)} 
          workspaces={workspaces} 
          onRestore={(pId) => setWorkspaces(prev => prev.map(ws => ({ ...ws, pages: ws.pages.map(p => p.id === pId ? {...p, isDeleted: false} : p)})))} 
          onPermanentDelete={(pId) => setWorkspaces(prev => prev.map(ws => ({ ...ws, pages: ws.pages.filter(p => p.id !== pId)})))} 
        />
        <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={() => {}} onGoogleDocImport={() => {}} onNotionImport={() => {}} />
        <CommentPanel isOpen={!!activeCommentContext?.isOpen} onClose={() => setActiveCommentContext(null)} comments={[]} members={activeWorkspace.members} currentUser={currentUser} onAddComment={() => {}} onResolve={() => {}} title="Discussion" />
      </main>
    </div>
  );
};

export default App;
