
import React, { useState } from 'react';
import { Comment, WorkspaceMember, User } from '../types';
import { ICONS } from '../constants';

interface CommentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  members: WorkspaceMember[];
  currentUser: WorkspaceMember;
  onAddComment: (content: string, replyToId?: string) => void;
  onResolve: (commentId: string) => void;
  title: string;
}


interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  members: WorkspaceMember[];
  onResolve: (id: string) => void;
  onReply: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, isReply = false, members, onResolve, onReply }) => {
  const author = members.find(m => m.id === comment.authorId);
  return (
    <div className={`group py-3 ${isReply ? 'ml-8 border-l border-gray-100 pl-4' : 'border-b border-gray-50'}`}>
      <div className="flex items-start gap-3">
        <img src={author?.avatar} className="w-8 h-8 rounded-full border" alt="" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-sm font-bold">{author?.name}</span>
            <span className="text-[10px] text-gray-400">
              {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>

          {!comment.isResolved && (
            <div className="mt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onReply(comment.id)}
                className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase"
              >
                Reply
              </button>
              {!isReply && (
                <button
                  onClick={() => onResolve(comment.id)}
                  className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase flex items-center gap-1"
                >
                  <ICONS.CheckCircle /> Resolve
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map(reply => (
        <CommentItem
          key={reply.id}
          comment={reply}
          isReply
          members={members}
          onResolve={onResolve}
          onReply={onReply}
        />
      ))}
    </div>
  );
};

const CommentPanel: React.FC<CommentPanelProps> = ({
  isOpen,
  onClose,
  comments,
  members,
  currentUser,
  onAddComment,
  onResolve,
  title
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment, replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
  };

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[100] flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-200">
      <header className="px-4 h-12 flex items-center justify-between border-b border-gray-100">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <ICONS.Message /> {title}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center opacity-50">
            <div className="mb-2 scale-150"><ICONS.Message /></div>
            <p className="text-xs">No comments yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {comments.map(c => (
              <CommentItem
                key={c.id}
                comment={c}
                members={members}
                onResolve={onResolve}
                onReply={setReplyingTo}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        {replyingTo && (
          <div className="mb-2 px-2 py-1 bg-gray-50 rounded text-[10px] flex items-center justify-between">
            <span className="text-gray-500 italic">Replying to thread...</span>
            <button onClick={() => setReplyingTo(null)}>✕</button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full text-sm border rounded-lg p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500/10 min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            className="absolute right-2 bottom-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <ICONS.Plus />
          </button>
        </form>
        <p className="text-[10px] text-gray-400 mt-2 text-center">Use @ to mention teammates</p>
      </div>
    </aside>
  );
};

export default CommentPanel;
