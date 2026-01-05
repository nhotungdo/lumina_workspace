
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { chatWithPage } from '../services/geminiService';
import { Block } from '../types';

interface ChatPanelProps {
    blocks: Block[];
    onClose: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ blocks, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hi! I can help you with this page. Ask me anything.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const context = blocks.map(b => b.content).join('\n');
        const response = await chatWithPage(context, userMsg.content);

        const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response || "Sorry, I couldn't generate a response." };
        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
    };

    return (
        <div className="fixed right-4 bottom-4 w-80 h-96 bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden z-[1000] animate-in slide-in-from-bottom-4">
            <div className="p-3 bg-purple-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium text-sm">
                    <ICONS.Sparkles /> Chat with Page
                </div>
                <button onClick={onClose} className="hover:bg-purple-700 p-1 rounded">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#1e1e1e]">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === 'user'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white dark:bg-[#333] border dark:border-gray-700 text-gray-800 dark:text-gray-200'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-[#333] border dark:border-gray-700 px-3 py-2 rounded-lg text-sm text-gray-400 flex gap-1">
                            <span className="animate-bounce">●</span>
                            <span className="animate-bounce delay-100">●</span>
                            <span className="animate-bounce delay-200">●</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t dark:border-gray-800 bg-white dark:bg-[#252525]">
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-gray-100 dark:bg-[#333] border-none rounded-md px-3 py-1.5 text-sm outline-none dark:text-white focus:ring-1 ring-purple-500"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-purple-600 text-white p-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
