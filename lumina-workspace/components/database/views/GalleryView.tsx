
import React from 'react';
import { ViewProps } from './types';
import { DatabasePropertyType } from '../../../types';

export const GalleryView: React.FC<ViewProps> = ({ data, properties }) => {
    // Find "file" or "image" property if we had one, or check for image blocks in children (if we were parsing children).
    // For now, simpler approach: just show content card.
    // Future: Check if row.content contains image URL or check a specific "Cover Image" property (URL type).

    const coverProperty = properties.find(p => p.type === DatabasePropertyType.URL || p.type === DatabasePropertyType.EMAIL);
    // Just heuristic: use URL property as image if available? Or just show Text.

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 min-h-[300px]">
            {data.map(item => {
                // Try to find a potential image URL
                const urlVal = coverProperty ? item.metadata?.propertyValues?.[coverProperty.id] : null;
                const isImage = urlVal?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

                return (
                    <div key={item.id} className="aspect-[3/4] bg-white dark:bg-[#252525] rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col">
                        {/* Cover Area */}
                        <div className="h-1/2 bg-gray-100 dark:bg-gray-800 w-full relative overflow-hidden">
                            {isImage ? (
                                <img src={urlVal} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 dark:text-gray-600">
                                    🖼️
                                </div>
                            )}
                            {/* Card Badge */}
                            {item.metadata?.checked && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">Done</div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-3 flex-1 flex flex-col">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{item.content || "Untitled"}</h3>
                            <div className="space-y-1 mt-auto">
                                {properties.filter(p => p.type === DatabasePropertyType.SELECT || p.type === DatabasePropertyType.MULTI_SELECT).slice(0, 3).map(p => {
                                    const val = item.metadata?.propertyValues?.[p.id];
                                    if (!val) return null;
                                    return (
                                        <div key={p.id} className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <span className="opacity-70">{p.name}:</span>
                                            <span className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{val}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* Placeholder for empty state */}
            {data.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-10">
                    No items to display.
                </div>
            )}
        </div>
    );
};
