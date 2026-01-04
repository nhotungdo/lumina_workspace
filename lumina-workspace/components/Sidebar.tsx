
import React, { useMemo, useState } from 'react';
import { Workspace, Page, Notification } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activePageId: string;
  onSelectWorkspace: (id: string) => void;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onAddWorkspace: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenTrash: () => void;
  onOpenInbox: () => void;
  trashCount: number;
  unreadNotificationsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  workspaces,
  activeWorkspaceId,
  activePageId,
  onSelectWorkspace,
  onSelectPage,
  onAddPage,
  onAddWorkspace,
  onOpenSearch,
  onOpenSettings,
  onOpenTrash,
  onOpenInbox,
  trashCount,
  unreadNotificationsCount
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);
  
  const favoritePages = useMemo(() => {
    return workspaces.flatMap(ws => 
      ws.pages
        .filter(p => p.isFavorite && !p.isDeleted)
        .map(p => ({ workspaceId: ws.id, page: p }))
    );
  }, [workspaces]);

  const visiblePages = activeWorkspace?.pages.filter(p => !p.isDeleted) || [];

  const NavItem = ({ 
    icon, 
    label, 
    active, 
    onClick, 
    count,
    badge
  }: { 
    icon: React.ReactNode, 
    label: string, 
    active?: boolean, 
    onClick: () => void,
    count?: number,
    badge?: number
  }) => (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer group text-sm transition-colors ${
        active 
          ? 'bg-[#efefed] dark:bg-[#2f2f2f] font-medium text-gray-900 dark:text-white' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-[#efefed] dark:hover:bg-[#2f2f2f] hover:text-gray-900 dark:hover:text-gray-200'
      }`}
    >
      <div className="w-4 flex justify-center text-xs opacity-70 relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#191919]" />
        )}
      </div>
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] bg-gray-200 dark:bg-[#373737] text-gray-500 dark:text-gray-400 font-bold px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );

  return (
    <aside className="w-64 h-screen bg-[#f7f6f3] dark:bg-[#1f1f1f] border-r border-[#ececeb] dark:border-[#373737] flex flex-col select-none relative group/sidebar">
      {/* Workspace Switcher */}
      <div className="p-3 relative">
        <div 
          className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${isSwitcherOpen ? 'bg-[#efefed] dark:bg-[#2f2f2f]' : 'hover:bg-[#efefed] dark:hover:bg-[#2f2f2f]'}`}
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
        >
          <div className="w-6 h-6 rounded bg-white dark:bg-[#2f2f2f] shadow-sm flex items-center justify-center text-sm border border-gray-100 dark:border-[#373737] flex-shrink-0">
            {activeWorkspace?.icon}
          </div>
          <span className="flex-1 font-bold text-sm truncate text-gray-700 dark:text-gray-200">{activeWorkspace?.name}</span>
          <div className={`text-gray-400 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`}><ICONS.ChevronDown /></div>
        </div>

        {isSwitcherOpen && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-gray-200 dark:border-[#373737] z-[100] py-2 animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Workspaces</div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {workspaces.map(ws => (
                <div 
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws.id);
                    setIsSwitcherOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2f2f2f] ${ws.id === activeWorkspaceId ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="w-5 h-5 rounded bg-gray-100 dark:bg-[#373737] flex items-center justify-center text-xs">{ws.icon}</div>
                  <span className={`text-sm flex-1 truncate ${ws.id === activeWorkspaceId ? 'font-bold dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {ws.name}
                  </span>
                  {ws.id === activeWorkspaceId && <div className="text-blue-500"><ICONS.CheckCircle /></div>}
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t dark:border-[#373737]">
               <div 
                 onClick={() => {
                   onAddWorkspace();
                   setIsSwitcherOpen(false);
                 }}
                 className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2f2f2f] text-gray-500 dark:text-gray-400 transition-colors"
               >
                 <ICONS.Plus />
                 <span className="text-xs font-medium">Create Workspace</span>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
        <NavItem 
          icon={<ICONS.Bell />} 
          label="Inbox" 
          onClick={onOpenInbox} 
          badge={unreadNotificationsCount}
        />
        <NavItem icon={<ICONS.Search />} label="Search" onClick={onOpenSearch} />
        <NavItem icon={<ICONS.Sparkles />} label="Settings" onClick={onOpenSettings} />
        
        {/* Favorites Section */}
        {favoritePages.length > 0 && (
          <div className="mt-4">
             <div className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Favorites</div>
             {favoritePages.map(({ workspaceId, page }) => (
               <NavItem 
                 key={page.id}
                 icon={page.icon || <ICONS.Page />}
                 label={page.title || 'Untitled'}
                 active={activePageId === page.id}
                 onClick={() => {
                   onSelectWorkspace(workspaceId);
                   onSelectPage(page.id);
                 }}
               />
             ))}
          </div>
        )}

        {/* Private Section (Workspace Pages) */}
        <div className="mt-4">
          <div className="flex items-center justify-between px-3 mb-1 group/header">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Workspace</span>
            <button 
              onClick={onAddPage}
              className="p-1 hover:bg-[#efefed] dark:hover:bg-[#2f2f2f] rounded opacity-0 group-hover/header:opacity-100 transition-opacity text-gray-400"
            >
              <ICONS.Plus />
            </button>
          </div>

          <div className="space-y-0.5">
            {visiblePages.map(page => (
              <NavItem 
                key={page.id}
                icon={page.icon || <ICONS.Page />}
                label={page.title || 'Untitled'}
                active={activePageId === page.id}
                onClick={() => onSelectPage(page.id)}
              />
            ))}
          </div>
          
          <div 
            onClick={onAddPage}
            className="flex items-center gap-2 px-3 py-1 text-gray-400 dark:text-gray-500 hover:bg-[#efefed] dark:hover:bg-[#2f2f2f] rounded cursor-pointer text-sm mt-1 transition-colors"
          >
            <ICONS.Plus />
            <span>Add a page</span>
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-[#ececeb] dark:border-[#373737] mt-auto">
        <NavItem 
          icon={<ICONS.Trash />} 
          label="Trash" 
          onClick={onOpenTrash} 
          count={trashCount} 
        />
      </div>
    </aside>
  );
};

export default Sidebar;
