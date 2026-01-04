
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Workspace, UserSettings, Theme, FontStyle, Language, PermissionRole } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWorkspace: Workspace;
  settings: UserSettings;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onUpdateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  onDeleteWorkspace: (id: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  activeWorkspace, 
  settings, 
  onUpdateSettings,
  onUpdateWorkspace,
  onDeleteWorkspace
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'workspace' | 'appearance' | 'language' | 'integrations' | 'members'>('account');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const SidebarItem = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
    <div 
      onClick={() => { setActiveTab(id); setDeleteConfirm(false); }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer text-sm font-medium transition-colors ${
        activeTab === id 
          ? 'bg-gray-200 dark:bg-[#373737] text-gray-900 dark:text-white' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]'
      }`}
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#252525] w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-[#373737]" onClick={e => e.stopPropagation()}>
        {/* Settings Sidebar */}
        <aside className="w-64 bg-[#f7f6f3] dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-[#373737] p-4 flex flex-col gap-6">
          <div className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Personal</h3>
            <SidebarItem id="account" label="My Account" icon={<ICONS.Search />} />
            <SidebarItem id="appearance" label="Appearance" icon={<ICONS.Sparkles />} />
            <SidebarItem id="language" label="Language & Region" icon={<ICONS.Plus />} />
          </div>

          <div className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Workspace</h3>
            <SidebarItem id="workspace" label="General Settings" icon={<ICONS.Settings />} />
            <SidebarItem id="members" label="Members" icon={<ICONS.CheckCircle />} />
            <SidebarItem id="integrations" label="Integrations" icon={<ICONS.Link />} />
          </div>

          <div className="mt-auto">
             <button 
               onClick={onClose}
               className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
             >
               <ICONS.Trash /> Log Out
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#252525]">
          <header className="px-8 py-4 border-b border-gray-100 dark:border-[#373737] flex justify-between items-center">
            <h2 className="text-lg font-bold dark:text-white">
              {activeTab === 'account' && 'My Account'}
              {activeTab === 'workspace' && 'Workspace Settings'}
              {activeTab === 'appearance' && 'Appearance'}
              {activeTab === 'language' && 'Language & Region'}
              {activeTab === 'integrations' && 'Integrations & API'}
              {activeTab === 'members' && 'Members & Roles'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">✕</button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'members' && (
              <div className="space-y-8 max-w-2xl">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold dark:text-white">Workspace Members</h4>
                      <p className="text-xs text-gray-500">Manage who has access to this workspace.</p>
                    </div>
                    <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition-colors">Invite Member</button>
                  </div>
                  
                  <div className="border dark:border-[#373737] rounded-xl overflow-hidden">
                    {activeWorkspace.members.map((member, i) => (
                      <div key={member.id} className={`flex items-center justify-between p-4 ${i !== 0 ? 'border-t dark:border-[#373737]' : ''}`}>
                         <div className="flex items-center gap-3">
                            <img src={member.avatar} className="w-10 h-10 rounded-full border dark:border-[#373737]" alt="" />
                            <div>
                               <div className="text-sm font-bold dark:text-white">{member.name}</div>
                               <div className="text-xs text-gray-500">{member.email}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${member.role === PermissionRole.OWNER ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-500'}`}>
                               {member.role}
                            </span>
                            {member.role !== PermissionRole.OWNER && (
                               <button className="text-gray-400 hover:text-red-500 transition-colors"><ICONS.Trash /></button>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="max-w-md space-y-8">
                <section className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Profile</h4>
                  <div className="flex items-center gap-4">
                    <img src="https://picsum.photos/seed/you/80/80" className="w-16 h-16 rounded-full border border-gray-200 dark:border-[#373737]" alt="Avatar" />
                    <button className="text-xs border border-gray-200 dark:border-[#373737] px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-[#2f2f2f] dark:text-gray-300">Change Photo</button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">Display Name</label>
                    <input type="text" className="w-full bg-transparent border border-gray-200 dark:border-[#373737] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white" defaultValue="Lumina User" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">Email Address</label>
                    <input type="email" readOnly className="w-full border border-gray-200 dark:border-[#373737] rounded-md px-3 py-2 text-sm bg-gray-50 dark:bg-[#1f1f1f] text-gray-400" value="user@lumina.ai" />
                  </div>
                </section>
                <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">Update Profile</button>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-10 max-w-2xl">
                <section className="space-y-4">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Theme</h4>
                    <p className="text-xs text-gray-500">Customize how Lumina looks on your device.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => onUpdateSettings({ theme: 'light' })}
                      className={`relative border-2 rounded-lg p-1 cursor-pointer transition-all ${settings.theme === 'light' ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 dark:border-[#373737] hover:border-gray-300 dark:hover:border-gray-500'}`}
                    >
                      <div className="bg-white h-24 rounded border border-gray-100 flex items-center justify-center">
                        <div className="w-12 h-2 bg-gray-100 rounded mb-2"></div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 px-1 pb-1">
                        <div className={`w-3 h-3 rounded-full border ${settings.theme === 'light' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}></div>
                        <span className="text-xs font-medium dark:text-gray-300">Light Mode</span>
                      </div>
                    </div>
                    <div 
                      onClick={() => onUpdateSettings({ theme: 'dark' })}
                      className={`relative border-2 rounded-lg p-1 cursor-pointer transition-all ${settings.theme === 'dark' ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 dark:border-[#373737] hover:border-gray-300 dark:hover:border-gray-500'}`}
                    >
                      <div className="bg-[#191919] h-24 rounded border border-[#373737] flex items-center justify-center">
                        <div className="w-12 h-2 bg-[#2f2f2f] rounded mb-2"></div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 px-1 pb-1">
                        <div className={`w-3 h-3 rounded-full border ${settings.theme === 'dark' ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></div>
                        <span className="text-xs font-medium dark:text-gray-300">Dark Mode</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Typography</h4>
                    <p className="text-xs text-gray-500">Pick the font style that suits your reading preference.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(['sans', 'serif', 'mono'] as FontStyle[]).map(font => (
                      <button
                        key={font}
                        onClick={() => onUpdateSettings({ fontStyle: font })}
                        className={`px-6 py-3 rounded-lg border text-sm transition-all capitalize ${
                          settings.fontStyle === font
                            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'border-gray-200 dark:border-[#373737] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2f2f2f]'
                        }`}
                        style={{ fontFamily: font === 'sans' ? 'Inter' : font === 'serif' ? 'Lora' : 'JetBrains Mono' }}
                      >
                        {font === 'sans' ? 'Default Sans' : font === 'serif' ? 'Serif' : 'Monospace'}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6 max-w-2xl">
                <section className="p-4 border dark:border-[#373737] rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-black flex items-center justify-center text-white font-bold text-xl">N</div>
                      <div>
                        <h4 className="text-sm font-bold dark:text-white">Notion Sync</h4>
                        <p className="text-xs text-gray-500">Connect your Notion databases to Lumina pages.</p>
                      </div>
                    </div>
                    <button className="bg-gray-900 text-white dark:bg-white dark:text-black text-xs px-4 py-2 rounded-md font-bold">Connect</button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'language' && (
               <div className="max-w-md space-y-8">
                  <section className="space-y-4">
                     <h4 className="text-sm font-bold text-gray-900 dark:text-white">Language</h4>
                     <p className="text-xs text-gray-500">Choose your preferred language for the Lumina interface.</p>
                     <select 
                        value={settings.language}
                        onChange={(e) => onUpdateSettings({ language: e.target.value as Language })}
                        className="w-full bg-transparent border border-gray-200 dark:border-[#373737] rounded-md px-3 py-2 text-sm outline-none dark:text-white"
                     >
                        <option value="en">English (US)</option>
                        <option value="vi">Tiếng Việt (Vietnamese)</option>
                     </select>
                  </section>
               </div>
            )}

            {activeTab === 'workspace' && (
              <div className="max-w-md space-y-8">
                 <section className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">General</h4>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500">Workspace Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-transparent border border-gray-200 dark:border-[#373737] rounded-md px-3 py-2 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20" 
                        defaultValue={activeWorkspace.name}
                        onBlur={(e) => onUpdateWorkspace(activeWorkspace.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500">Icon</label>
                      <div className="text-4xl p-4 border border-gray-200 dark:border-[#373737] rounded-md w-fit cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2f2f2f]">{activeWorkspace.icon}</div>
                    </div>
                 </section>
                 <section className="pt-8 border-t border-gray-100 dark:border-[#373737]">
                    <h4 className="text-xs font-bold text-red-500 uppercase mb-4">Danger Zone</h4>
                    {!deleteConfirm ? (
                      <button 
                        onClick={() => setDeleteConfirm(true)}
                        className="border border-red-200 text-red-500 text-sm px-4 py-2 rounded-md font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete Workspace
                      </button>
                    ) : (
                      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                        <p className="text-xs text-red-700 dark:text-red-400 mb-3 font-medium">Are you absolutely sure? All data in "{activeWorkspace.name}" will be lost forever.</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { onDeleteWorkspace(activeWorkspace.id); onClose(); }}
                            className="bg-red-600 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-red-700"
                          >
                            Yes, delete permanently
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(false)}
                            className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1.5 font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                 </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsModal;
