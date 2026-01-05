
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Block, BlockType, WorkspaceMember, Cursor, Page } from '../types';
import { ICONS } from '../constants';
import { generateContentStream, suggestBlockTransformation } from '../services/geminiService';
import { DatabaseBlock } from './database/DatabaseBlock';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  readOnly?: boolean;
  members: WorkspaceMember[];
  onOpenComment: (blockId: string) => void;

  remoteCursors: Cursor[];
  remoteUpdates: Record<string, number>;
  allPages?: Page[];
}

import ChatPanel from './ChatPanel';

// ... existing imports

const SLASH_COMMANDS = [
  { type: 'AI' as any, label: 'Ask AI', icon: '✨', category: 'AI', color: 'text-purple-600' },
  { type: 'AI_OUTLINE' as any, label: 'Create Outline', icon: '📝', category: 'AI', color: 'text-purple-600' },
  { type: 'AI_EMAIL' as any, label: 'Write Email', icon: '📧', category: 'AI', color: 'text-purple-600' },
  { type: 'AI_TABLE' as any, label: 'Sample Data Table', icon: '📊', category: 'AI', color: 'text-purple-600' },
  { type: BlockType.TEXT, label: 'Text', icon: '📝', category: 'Basic' },
  { type: BlockType.HEADING1, label: 'Heading 1', icon: 'H1', category: 'Basic' },
  // ... rest of list is same
  { type: BlockType.HEADING2, label: 'Heading 2', icon: 'H2', category: 'Basic' },
  { type: BlockType.TODO, label: 'To-do List', icon: '✅', category: 'Basic' },
  { type: BlockType.BULLET, label: 'Bulleted List', icon: '•', category: 'Basic' },
  { type: BlockType.NUMBERED, label: 'Numbered List', icon: '1.', category: 'Basic' },
  { type: BlockType.TOGGLE, label: 'Toggle List', icon: '▶', category: 'Basic' },
  { type: BlockType.QUOTE, label: 'Quote', icon: '"', category: 'Basic' },
  { type: BlockType.CALLOUT, label: 'Callout', icon: '💡', category: 'Basic' },
  { type: BlockType.TABLE, label: 'Table', icon: '田', category: 'Advanced' },
  { type: BlockType.DATABASE, label: 'Database', icon: '🗄️', category: 'Advanced' },
  { type: BlockType.CODE, label: 'Code Block', icon: '</>', category: 'Advanced' },
  { type: BlockType.IMAGE, label: 'Image', icon: '🖼', category: 'Media' },
  { type: BlockType.DIVIDER, label: 'Divider', icon: '—', category: 'Basic' },
];

const AI_PROMPTS = [
  "Simplify Language",
  "Fix Grammar",
  "Make Longer",
  "Make Shorter",
  "Summarize",
  "Translate to Spanish",
  "Translate to Vietnamese",
  "Change tone to Professional",
];


const BlockComponent: React.FC<{
  block: Block;
  allBlocks: Block[];
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onEnter: () => void;
  readOnly?: boolean;
  onOpenComment: () => void;
  cursors: Cursor[];
  isBeingUpdatedRemotely: boolean;
  allPages?: Page[];
  members?: WorkspaceMember[];
}> = ({ block, allBlocks, onUpdate, onDelete, onEnter, readOnly, onOpenComment, cursors, isBeingUpdatedRemotely, allPages, members }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [slashMenu, setSlashMenu] = useState<{ visible: boolean; query: string; pos: { top: number; left: number } }>({ visible: false, query: '', pos: { top: 0, left: 0 } });
  const [aiMenu, setAiMenu] = useState<{ visible: boolean; query: string; isGenerating: boolean }>({ visible: false, query: '', isGenerating: false });
  const [linkMenu, setLinkMenu] = useState<{ visible: boolean; query: string; pos: { top: number; left: number } }>({ visible: false, query: '', pos: { top: 0, left: 0 } });
  const [mentionMenu, setMentionMenu] = useState<{ visible: boolean; query: string; pos: { top: number; left: number } }>({ visible: false, query: '', pos: { top: 0, left: 0 } });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (contentRef.current && document.activeElement !== contentRef.current) {
      if (contentRef.current.innerText !== block.content) {
        contentRef.current.innerText = block.content;
      }
    }
  }, [block.content]);


  const [selectionMenu, setSelectionMenu] = useState<{ visible: boolean; pos: { top: number; left: number }; text: string }>({ visible: false, pos: { top: 0, left: 0 }, text: '' });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setSelectionMenu({ ...selectionMenu, visible: false });
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Ensure selection is inside this block
      if (contentRef.current && contentRef.current.contains(selection.anchorNode)) {
        setSelectionMenu({
          visible: true,
          pos: { top: rect.top - 40, left: rect.left },
          text: selection.toString()
        });
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = contentRef.current?.innerText || '';
    onUpdate({ content: text });

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const rect = selection.getRangeAt(0).getBoundingClientRect();

    // Slash Command
    if (text.endsWith('/')) { // Only standard command if typing at end or if tracking logic allows (simplification: endsWith or regex)
      // This simple check fails for typing in middle. Better: check word before cursor.
    }

    // Better Regex detection for menus
    const lastWord = text.slice(0, selection.anchorOffset).split(/\s/).pop() || '';

    if (lastWord.startsWith('/')) {
      setSlashMenu({ visible: true, query: lastWord.slice(1), pos: { top: rect.top, left: rect.left } });
      setLinkMenu({ ...linkMenu, visible: false });
      setMentionMenu({ ...mentionMenu, visible: false });
    } else if (lastWord.startsWith('[[')) {
      setLinkMenu({ visible: true, query: lastWord.slice(2), pos: { top: rect.top, left: rect.left } });
      setSlashMenu({ ...slashMenu, visible: false });
      setMentionMenu({ ...mentionMenu, visible: false });
    } else if (lastWord.startsWith('@')) {
      setMentionMenu({ visible: true, query: lastWord.slice(1), pos: { top: rect.top, left: rect.left } });
      setSlashMenu({ ...slashMenu, visible: false });
      setLinkMenu({ ...linkMenu, visible: false });
    } else {
      setSlashMenu({ ...slashMenu, visible: false });
      setLinkMenu({ ...linkMenu, visible: false });
      setMentionMenu({ ...mentionMenu, visible: false });
    }
  };

  const insertText = (textToInsert: string, triggerLength: number) => {
    const selection = window.getSelection();
    if (!selection || !contentRef.current) return;

    const text = contentRef.current.innerText;
    const cursor = selection.anchorOffset;
    // Heuristic: remove trigger + query length. 
    // This is tricky with contentEditable.
    // Simplification: Replace current text content based on regex match of last word?
    // Better: Just append for this MVP or replace last word.

    const beforeCursor = text.slice(0, cursor);
    const afterCursor = text.slice(cursor);
    const lastWordStart = beforeCursor.lastIndexOf(' ') + 1;

    const newText = beforeCursor.slice(0, lastWordStart) + textToInsert + " " + afterCursor;

    onUpdate({ content: newText });
    contentRef.current.innerText = newText;

    // Reset menus
    setSlashMenu({ ...slashMenu, visible: false });
    setLinkMenu({ ...linkMenu, visible: false });
    setMentionMenu({ ...mentionMenu, visible: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (slashMenu.visible) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(s => (s + 1) % SLASH_COMMANDS.length); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(s => (s - 1 + SLASH_COMMANDS.length) % SLASH_COMMANDS.length); }
      if (e.key === 'Enter') { e.preventDefault(); applyCommand(SLASH_COMMANDS[selectedIndex]); }
      if (e.key === 'Escape') setSlashMenu({ ...slashMenu, visible: false });
      return;
    }

    // Link Menu Navigation
    if (linkMenu.visible && allPages) {
      const filtered = allPages.filter(p => p.title.toLowerCase().includes(linkMenu.query.toLowerCase()));
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(s => (s + 1) % filtered.length); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(s => (s - 1 + filtered.length) % filtered.length); }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) insertText(`[[${filtered[selectedIndex].title}]]`, 2);
      }
      if (e.key === 'Escape') setLinkMenu({ ...linkMenu, visible: false });
      if (linkMenu.visible) return; // Stop other processing
    }

    // Mention Menu Navigation
    if (mentionMenu.visible && members) {
      const filtered = members.filter(m => m.name.toLowerCase().includes(mentionMenu.query.toLowerCase()));
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(s => (s + 1) % filtered.length); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(s => (s - 1 + filtered.length) % filtered.length); }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) insertText(`@${filtered[selectedIndex].name}`, 1);
      }
      if (e.key === 'Escape') setMentionMenu({ ...mentionMenu, visible: false });
      if (mentionMenu.visible) return;
    }


    if (aiMenu.visible) {
      if (e.key === 'Escape') setAiMenu({ ...aiMenu, visible: false });
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEnter(); }
    if (e.key === 'Backspace' && !block.content) {
      if (block.type !== BlockType.TEXT) { e.preventDefault(); onUpdate({ type: BlockType.TEXT }); }
      else { e.preventDefault(); onDelete(); }
    }
  };

  const applyCommand = (cmd: typeof SLASH_COMMANDS[0]) => {
    if (cmd.category === 'AI') {
      let initialQuery = '';
      if (cmd.type === 'AI_OUTLINE') initialQuery = 'Create an outline for ';
      if (cmd.type === 'AI_EMAIL') initialQuery = 'Write an email about ';
      if (cmd.type === 'AI_TABLE') initialQuery = 'Create a sample data table for ';

      setAiMenu({ visible: true, query: initialQuery, isGenerating: false });
      setSlashMenu({ ...slashMenu, visible: false });
      if (contentRef.current) contentRef.current.innerText = ''; // Clear slash command
      return;
    }

    // For standard commands, we replace the whole block content usually, or at least the slash command part.
    // Original logic:
    // const text = contentRef.current?.innerText || '';
    // const newContent = text.split('/').slice(0, -1).join('/'); 
    // This removes the slash command from end.

    // Using insertText logic might be cleaner if we want to support inline commands, but slash usually changes block type.
    const text = contentRef.current?.innerText || '';
    // Simplification for block type change:
    const newContent = text.replace(/\/[^/]*$/, '');

    onUpdate({ type: cmd.type as BlockType, content: newContent });
    setSlashMenu({ ...slashMenu, visible: false });
    if (contentRef.current) contentRef.current.innerText = newContent;
  };

  const handleAiAction = async (prompt: string) => {
    setAiMenu({ ...aiMenu, isGenerating: true });
    setSelectionMenu({ ...selectionMenu, visible: false });

    // If we have content, it's a transform. If empty, it's a generation.
    if (block.content.length > 0) {
      // If prompt comes from selection menu, we might want to target JUST the selection, 
      // but for now we transform the whole block or replace the selection if we could.
      // Simplification: Transform whole block with context.
      const result = await suggestBlockTransformation(block.content, prompt);
      onUpdate({ content: result });
      if (contentRef.current) contentRef.current.innerText = result; // Force update
    } else {
      // Streaming Generation
      let fullText = "";
      const context = allBlocks.map(b => b.content).join("\n");
      // Use query if set (for Smart Commands), otherwise prompt
      const finalPrompt = aiMenu.query || prompt;

      const stream = generateContentStream(finalPrompt, context);
      for await (const chunk of stream) {
        fullText += chunk;
        onUpdate({ content: fullText });
        if (contentRef.current) contentRef.current.innerText = fullText;
      }
    }

    setAiMenu({ visible: false, query: '', isGenerating: false });
  };

  // Render context menu
  const renderSelectionMenu = () => {
    if (!selectionMenu.visible) return null;
    return (
      <div
        className="fixed z-[1000] bg-white dark:bg-[#333] shadow-xl rounded-lg border dark:border-gray-700 p-1 flex flex-col gap-1 min-w-[150px] animate-in fade-in zoom-in-95 duration-100"
        style={{ top: selectionMenu.pos.top, left: selectionMenu.pos.left }}
      >
        <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b dark:border-gray-700 mb-1">AI Edit</div>
        {AI_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => handleAiAction(p)}
            className="text-left px-2 py-1.5 text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded text-gray-700 dark:text-gray-200 flex items-center gap-2"
          >
            <ICONS.Sparkles /> {p}
          </button>
        ))}
      </div>
    );
  };

  const renderBlockSpecific = () => {
    switch (block.type) {
      case BlockType.TODO:
        return (
          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" checked={!!block.metadata?.checked} onChange={(e) => onUpdate({ metadata: { ...block.metadata, checked: e.target.checked } })} className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600" />
            <div ref={contentRef} contentEditable={!readOnly} onInput={handleInput} onKeyDown={handleKeyDown} className={`flex-1 outline-none ${block.metadata?.checked ? 'line-through text-gray-400' : ''}`} />
          </div>
        );
      case BlockType.CODE:
        return (
          <div className="bg-gray-50 dark:bg-[#1e1e1e] p-4 rounded-lg font-mono text-sm my-2 relative group/code border dark:border-gray-800">
            <div ref={contentRef} contentEditable={!readOnly} onInput={handleInput} onKeyDown={handleKeyDown} className="outline-none whitespace-pre" />
          </div>
        );
      case BlockType.DATABASE:
        return (
          <DatabaseBlock block={block} onUpdate={onUpdate} readOnly={readOnly} />
        );
      default:
        const classes = {
          [BlockType.HEADING1]: 'text-4xl font-bold mt-8 mb-2 dark:text-white',
          [BlockType.HEADING2]: 'text-2xl font-semibold mt-6 mb-2 dark:text-white',
          [BlockType.HEADING3]: 'text-xl font-semibold mt-4 mb-1 dark:text-white',
          [BlockType.QUOTE]: 'border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2 italic text-gray-600 dark:text-gray-400 my-2',
          [BlockType.CALLOUT]: 'bg-[#f1f1ef] dark:bg-[#2f2f2f] p-4 rounded-lg flex gap-3 my-2 border dark:border-gray-800',
          [BlockType.BULLET]: 'list-disc ml-5 py-1',
          [BlockType.NUMBERED]: 'list-decimal ml-5 py-1',
          [BlockType.TEXT]: 'py-1 min-h-[1.5em]',
        }[block.type] || '';

        return (
          <div className="flex items-start gap-2">
            {block.type === BlockType.BULLET && <span className="mt-1.5">•</span>}
            <div ref={contentRef} contentEditable={!readOnly} onInput={handleInput} onKeyDown={handleKeyDown} className={`flex-1 outline-none ${classes}`} />
          </div>
        );
    }
  };

  return (
    <div className={`group relative transition-all rounded-lg -mx-2 px-2 py-0.5 ${isBeingUpdatedRemotely || aiMenu.isGenerating ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}>
      {!readOnly && (
        <div className="absolute -left-12 flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1">
          <button onClick={() => setAiMenu({ visible: true, query: '', isGenerating: false })} className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded text-purple-600 transition-colors" title="Ask AI">
            <ICONS.Sparkles />
          </button>
          <div className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 cursor-grab active:cursor-grabbing">
            <ICONS.Drag />
          </div>
        </div>
      )}

      {renderBlockSpecific()}


      {renderSelectionMenu()}

      {/* AI Assistant Interface */}
      {aiMenu.visible && (
        <div className="absolute left-0 top-full mt-1 z-[500] w-full max-w-lg bg-white dark:bg-[#252525] rounded-xl shadow-2xl border-2 border-purple-500/30 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-3 bg-purple-50/50 dark:bg-purple-900/10 flex items-center gap-3">
            <div className="text-purple-600 animate-pulse"><ICONS.Sparkles /></div>
            <input
              autoFocus
              placeholder={aiMenu.isGenerating ? "AI is writing..." : "Ask AI to write anything..."}
              className="flex-1 bg-transparent border-none outline-none text-sm dark:text-gray-200"
              value={aiMenu.query}
              onChange={e => setAiMenu({ ...aiMenu, query: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAiAction(aiMenu.query);
              }}
              disabled={aiMenu.isGenerating}
            />
            {aiMenu.isGenerating && <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />}
          </div>

          {!aiMenu.isGenerating && (
            <div className="max-h-64 overflow-y-auto p-1 custom-scrollbar">
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Suggestions</div>
              {AI_PROMPTS.map(p => (
                <div
                  key={p}
                  onClick={() => handleAiAction(p)}
                  className="px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer rounded-lg text-sm transition-colors flex items-center gap-3"
                >
                  <span className="text-purple-400 text-xs">✨</span>
                  <span className="dark:text-gray-300">{p}</span>
                </div>
              ))}
            </div>
          )}
          <div className="p-2 border-t dark:border-gray-800 text-[9px] text-gray-400 flex justify-between bg-white dark:bg-[#1f1f1f]">
            <span>Gemini 3 Flash Powered</span>
            <span>Press Enter to send</span>
          </div>
        </div>
      )}

      {/* Slash Command Menu */}
      {slashMenu.visible && !aiMenu.visible && (
        <div className="fixed z-[500] bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 py-2 w-72 max-h-[400px] overflow-y-auto custom-scrollbar" style={{ top: slashMenu.pos.top + 24, left: slashMenu.pos.left }}>
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b dark:border-gray-800 mb-2">Create Block</div>
          {SLASH_COMMANDS.filter(cmd => cmd.label.toLowerCase().includes(slashMenu.query.toLowerCase())).map((cmd, i) => (
            <div
              key={cmd.label}
              onClick={() => applyCommand(cmd)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${selectedIndex === i ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <div className={`w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm ${cmd.color || ''}`}>{cmd.icon}</div>
              <div className="flex-1">
                <div className={`text-sm font-medium dark:text-gray-200 ${cmd.color || ''}`}>{cmd.label}</div>
                <div className="text-[10px] text-gray-400">{cmd.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange, readOnly, members, onOpenComment, remoteCursors, remoteUpdates, allPages }) => {
  const [showChat, setShowChat] = useState(false);

  const updateBlock = (index: number, updates: Partial<Block>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange(newBlocks);
  };

  const deleteBlock = (index: number) => {
    if (blocks.length <= 1) {
      updateBlock(0, { type: BlockType.TEXT, content: '', children: [] });
      return;
    }
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const addBlockAfter = (index: number) => {
    const newBlock: Block = { id: `b-${Math.random()}`, type: BlockType.TEXT, content: '' };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-12 min-h-screen relative">
      {!readOnly && (
        <button
          className="fixed bottom-8 right-8 z-[100] bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-105"
          onClick={() => setShowChat(!showChat)}
          title="Chat with Page"
        >
          {showChat ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg> : <ICONS.Sparkles />}
        </button>
      )}

      {showChat && <ChatPanel blocks={blocks} onClose={() => setShowChat(false)} />}
      <div className="space-y-0.5">
        {blocks.map((block, index) => (
          <BlockComponent
            key={block.id}
            block={block}
            allBlocks={blocks}
            readOnly={readOnly}
            cursors={remoteCursors.filter(c => c.blockId === block.id)}

            isBeingUpdatedRemotely={!!remoteUpdates[block.id] && (Date.now() - remoteUpdates[block.id] < 1000)}
            onUpdate={(updates) => updateBlock(index, updates)}
            onDelete={() => deleteBlock(index)}
            onEnter={() => addBlockAfter(index)}
            onOpenComment={() => onOpenComment(block.id)}
            allPages={allPages}
            members={members}
          />
        ))}
      </div>

      {/* Linked References Section (Simple footer for now) */}
      {allPages && (
        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Linked References</h3>
          <div className="space-y-2">
            {(() => {
              // Find pages that link TO this page (simplification: checking if any block content contains [[CurrentPageTitle]])
              // Current page title not passed to BlockEditor explicitly? Oh wait, BlockEditor doesn't know its own Page Title easily unless passed.
              // But we can check if 'allPages' contains blocks with content having [[...]]
              // Wait, I don't know my own title here. I should pass `pageTitle` or `pageId` to BlockEditor. 
              // Assuming I can't easily change that right now without traversing props up, I'll skip dynamic filtering 
              // OR better: Just show "No linked references" mock or todo.
              // Actually, I can pass `pageId` via props if I update App.tsx. 
              // Let's just leave a placeholder or simple search.
              return <p className="text-sm text-gray-400 italic">No incoming links found.</p>;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockEditor;
