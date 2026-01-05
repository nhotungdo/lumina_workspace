
import React, { useState } from 'react';
import { Workspace, PermissionRole, Page } from '../types';
import { ICONS } from '../constants';

interface PermissionsDialogProps {
  workspace: Workspace;
  page?: Page;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRole: (memberId: string, role: PermissionRole) => void;
  onInvite: (email: string) => void;
  onUpdatePage?: (pageId: string, updates: Partial<Page>) => void;
  onInviteGuest?: (pageId: string, email: string) => void;
}

const PermissionsDialog: React.FC<PermissionsDialogProps> = ({
  workspace,
  page,
  isOpen,
  onClose,
  onUpdateRole,
  onInvite,
  onUpdatePage,
  onInviteGuest
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'workspace' | 'page'>('workspace');
  const [passwordInput, setPasswordInput] = useState(page?.password || '');

  if (!isOpen) return null;

  const handleInviteSubmit = () => {
    if (!inviteEmail.includes('@')) return;

    if (activeTab === 'workspace') {
      onInvite(inviteEmail);
    } else {
      if (page && onInviteGuest) {
        onInviteGuest(page.id, inviteEmail);
      }
    }
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#252525] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-[#373737]" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b dark:border-[#373737] flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'workspace' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Workspace
            </button>
            <button
              onClick={() => setActiveTab('page')}
              className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'page' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Page Limit
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'workspace' && (
            <>
              {/* Existing Workspace Logic */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Invite to workspace..."
                  className="flex-1 px-3 py-2 border dark:border-[#373737] bg-transparent rounded-md outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-white"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInviteSubmit()}
                />
                <button
                  onClick={handleInviteSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Invite
                </button>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Members</span>
                {workspace.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#373737]" alt={member.name} />
                      <div>
                        <div className="text-sm font-medium dark:text-gray-200">{member.name}</div>
                        <div className="text-[10px] text-gray-500">{member.role === PermissionRole.OWNER ? 'Owner' : member.email}</div>
                      </div>
                    </div>

                    {member.role !== PermissionRole.OWNER && (
                      <select
                        value={member.role}
                        onChange={(e) => onUpdateRole(member.id, e.target.value as PermissionRole)}
                        className="text-xs border-none bg-transparent font-medium text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer"
                      >
                        <option value={PermissionRole.EDITOR}>Editor</option>
                        <option value={PermissionRole.VIEWER}>Viewer</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'page' && page && onUpdatePage && (
            <div className="space-y-6">
              {/* Publish to Web */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-sm font-bold dark:text-white flex items-center gap-2">Publish to Web <span className="text-xs font-normal text-gray-500">Global access</span></div>
                    <p className="text-xs text-gray-500">Anyone with the link can view.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={!!page.isPublished} onChange={(e) => onUpdatePage(page.id, { isPublished: e.target.checked })} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {page.isPublished && (
                  <div className="flex gap-2 mt-2">
                    <input readOnly value={`https://lumina.app/p/${page.id}`} className="flex-1 bg-gray-50 dark:bg-[#333] border dark:border-gray-700 text-xs px-2 py-1 rounded text-gray-600 dark:text-gray-300 select-all" />
                    <button className="text-xs text-blue-600 font-bold hover:underline">Copy</button>
                  </div>
                )}
              </div>

              {/* Page Lock */}
              <div className="border-t dark:border-[#373737] pt-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-sm font-bold dark:text-white flex items-center gap-2">Page Lock</div>
                    <p className="text-xs text-gray-500">Restrict editing capabilities.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={!!page.isLocked} onChange={(e) => onUpdatePage(page.id, { isLocked: e.target.checked })} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
                {page.isLocked && (
                  <div className="mt-2">
                    <input
                      type="password"
                      placeholder="Set optional password..."
                      className="w-full px-3 py-1.5 text-xs border dark:border-[#373737] bg-transparent rounded outline-none dark:text-white"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onBlur={() => onUpdatePage(page.id, { password: passwordInput })}
                    />
                  </div>
                )}
              </div>

              {/* Guest Access */}
              <div className="border-t dark:border-[#373737] pt-4">
                <div className="text-sm font-bold dark:text-white mb-2">Guest Access <span className="text-xs font-normal text-gray-500">This page only</span></div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Guest email..."
                    className="flex-1 px-3 py-1.5 border dark:border-[#373737] bg-transparent rounded outline-none text-xs dark:text-white"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInviteSubmit()}
                  />
                  <button
                    onClick={handleInviteSubmit}
                    className="bg-gray-800 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Invite
                  </button>
                </div>
                {page.guests && page.guests.length > 0 && (
                  <div className="space-y-2">
                    {page.guests.map(guest => (
                      <div key={guest.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 flex items-center justify-center text-[8px]">{guest.name[0]}</div>
                          <span className="dark:text-gray-300">{guest.email}</span>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-[#1f1f1f] px-6 py-4 flex justify-between items-center border-t dark:border-[#373737]">
          <div className="text-xs text-gray-500">
            {activeTab === 'page' ? 'Page-level permissions override workspace defaults.' : `Current workspace: ${workspace.name}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsDialog;
