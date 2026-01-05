
import React from 'react';
import { Page, BlockType } from '../types';
import { ICONS } from '../constants';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUseTemplate: (template: Page) => void;
    templates: Page[];
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onUseTemplate, templates }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#252525] rounded-xl shadow-2xl w-full max-w-4xl h-[70vh] flex overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-[#373737]">

                {/* Sidebar */}
                <div className="w-64 border-r dark:border-[#373737] bg-gray-50 dark:bg-[#1f1f1f] p-4 flex flex-col">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Templates</h2>
                    <div className="space-y-1">
                        <div className="px-3 py-2 bg-white dark:bg-[#2f2f2f] rounded shadow-sm text-sm font-medium dark:text-white cursor-pointer">
                            All Templates
                        </div>
                        {/* Categories could go here */}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <div className="border-b dark:border-[#373737] p-4 flex justify-between items-center bg-white dark:bg-[#252525]">
                        <h3 className="font-bold text-lg dark:text-white">Choose a template</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white dark:bg-[#252525]">
                        {templates.map(t => (
                            <div
                                key={t.id}
                                className="border dark:border-[#373737] rounded-lg p-4 hover:shadow-lg hover:border-purple-500 transition-all cursor-pointer group bg-white dark:bg-[#1e1e1e]"
                                onClick={() => {
                                    onUseTemplate(t);
                                    onClose();
                                }}
                            >
                                <div className="text-3xl mb-3">{t.icon || '📄'}</div>
                                <div className="font-bold dark:text-gray-200 mb-1">{t.title}</div>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                    {t.blocks.length} blocks. Click to use.
                                </p>
                                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-full py-1.5 bg-purple-600 text-white rounded text-xs font-bold shadow-sm">Use this template</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
