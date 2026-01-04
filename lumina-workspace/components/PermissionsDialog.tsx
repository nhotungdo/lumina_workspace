
import React, { useState } from 'react';
import { Workspace, PermissionRole } from '../types';

interface PermissionsDialogProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRole: (memberId: string, role: PermissionRole) => void;
  onInvite: (email: string) => void;
}

const PermissionsDialog: React.FC<PermissionsDialogProps> = ({
  workspace,
  isOpen,
  onClose,
  onUpdateRole,
  onInvite
}) => {
  const [inviteEmail, setInviteEmail] = useState('');

  if (!isOpen) return null;

  const handleInviteSubmit = () => {
    if (inviteEmail.includes('@')) {
      onInvite(inviteEmail);
      setInviteEmail('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#252525] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-[#373737]" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b dark:border-[#373737] flex justify-between items-center">
          <h2 className="text-lg font-bold dark:text-white">Share Workspace</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Add by email..." 
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
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Access List</span>
            {workspace.members.map(member => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#373737]" alt={member.name} />
                  <div>
                    <div className="text-sm font-medium dark:text-gray-200">{member.name}</div>
                    <div className="text-[10px] text-gray-500">{member.role === PermissionRole.OWNER ? 'Workspace Owner' : member.email}</div>
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
        </div>

        <div className="bg-gray-50 dark:bg-[#1f1f1f] px-6 py-4 flex justify-between items-center border-t dark:border-[#373737]">
          <div className="text-xs text-gray-500">
            Current workspace: <span className="font-bold">{workspace.name}</span>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:underline">Copy Link</button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsDialog;
