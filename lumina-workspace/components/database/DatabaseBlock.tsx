
import React, { useState } from 'react';
import {
    Block, BlockType,
    DatabaseView, DatabaseProperty,
    DatabaseViewType, DatabasePropertyType
} from '../../types';
import { TableView } from './views/TableView';
import { BoardView } from './views/BoardView';
import { CalendarView } from './views/CalendarView';
import { GalleryView } from './views/GalleryView';
import { Plus, List, Kanban, Calendar, Image as ImageIcon, Filter, ArrowUpDown } from 'lucide-react';

interface DatabaseBlockProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    readOnly?: boolean;
}

export const DatabaseBlock: React.FC<DatabaseBlockProps> = ({ block, onUpdate, readOnly }) => {
    // Initialize config if missing
    const config = block.metadata?.databaseConfig || {
        views: [{ id: 'default', name: 'Table', type: DatabaseViewType.TABLE }],
        properties: [
            { id: 'name', name: 'Name', type: DatabasePropertyType.TEXT }
        ],
        currentViewId: 'default'
    };

    const currentView = config.views.find(v => v.id === config.currentViewId) || config.views[0];

    const handleUpdateConfig = (newConfig: any) => {
        onUpdate({
            metadata: {
                ...block.metadata,
                databaseConfig: newConfig
            }
        });
    };

    const handleUpdateRow = (rowId: string, updates: Partial<Block>) => {
        const newChildren = block.children?.map(child =>
            child.id === rowId ? { ...child, ...updates } : child
        ) || [];
        onUpdate({ children: newChildren });
    };

    const handleAddRow = () => {
        const newRow: Block = {
            id: crypto.randomUUID(),
            type: BlockType.TEXT,
            content: '', // Title
            metadata: {
                propertyValues: {}
            }
        };
        onUpdate({
            children: [...(block.children || []), newRow]
        });
    };


    const handleAddProperty = (name: string, type: DatabasePropertyType) => {
        const newProp: DatabaseProperty = {
            id: name.toLowerCase().replace(/\s+/g, '_') + '_' + crypto.randomUUID().slice(0, 4),
            name,
            type
        };
        handleUpdateConfig({
            ...config,
            properties: [...config.properties, newProp]
        });
    };

    const handleUpdateProperty = (property: DatabaseProperty) => {
        handleUpdateConfig({
            ...config,
            properties: config.properties.map(p => p.id === property.id ? property : p)
        });
    };


    const [activeSort, setActiveSort] = useState<{ propertyId: string, direction: 'asc' | 'desc' } | null>(null);

    // Filter and Sort Logic
    // Sort
    const processedData = [...(block.children || [])].sort((a, b) => {
        if (!activeSort) return 0;

        // Special case for 'name' which is content
        let valA, valB;
        if (activeSort.propertyId === 'name') {
            valA = a.content;
            valB = b.content;
        } else {
            valA = a.metadata?.propertyValues?.[activeSort.propertyId];
            valB = b.metadata?.propertyValues?.[activeSort.propertyId];
        }

        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (valA < valB) return activeSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return activeSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const renderView = () => {
        const props = {
            data: processedData,
            properties: config.properties,
            view: currentView,
            onUpdateRow: handleUpdateRow,
            onAddRow: handleAddRow,
            onAddProperty: handleAddProperty,
            onUpdateProperty: handleUpdateProperty
        };

        switch (currentView.type) {
            case DatabaseViewType.BOARD: return <BoardView {...props} />;
            case DatabaseViewType.CALENDAR: return <CalendarView {...props} />;
            case DatabaseViewType.GALLERY: return <GalleryView {...props} />;
            case DatabaseViewType.TABLE:
            default: return <TableView {...props} />;
        }
    };

    // Helper to add a view
    const addView = (type: DatabaseViewType) => {
        const newView: DatabaseView = {
            id: crypto.randomUUID(),
            name: type.charAt(0).toUpperCase() + type.slice(1),
            type: type
        };
        handleUpdateConfig({
            ...config,
            views: [...config.views, newView],
            currentViewId: newView.id
        });
    };

    return (
        <div className="border rounded-lg border-gray-200 dark:border-gray-800 my-4 bg-white dark:bg-[#1e1e1e] overflow-hidden shadow-sm">
            {/* Header: View Switcher */}
            <div className="flex items-center border-b border-gray-200 dark:border-gray-800 p-2 gap-2 bg-gray-50/50 dark:bg-[#252525]">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {config.views.map(view => (
                        <button
                            key={view.id}
                            onClick={() => handleUpdateConfig({ ...config, currentViewId: view.id })}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${config.currentViewId === view.id ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333]'}`}
                        >
                            {view.type === DatabaseViewType.TABLE && <List size={14} />}
                            {view.type === DatabaseViewType.BOARD && <Kanban size={14} />}
                            {view.type === DatabaseViewType.CALENDAR && <Calendar size={14} />}
                            {view.type === DatabaseViewType.GALLERY && <ImageIcon size={14} />}
                            {view.name}
                        </button>
                    ))}

                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
                    <button onClick={() => addView(DatabaseViewType.BOARD)} className="p-1 hover:bg-gray-200 dark:hover:bg-[#333] rounded text-gray-500" title="Add Board View"><Kanban size={14} /></button>
                    <button onClick={() => addView(DatabaseViewType.CALENDAR)} className="p-1 hover:bg-gray-200 dark:hover:bg-[#333] rounded text-gray-500" title="Add Calendar View"><Calendar size={14} /></button>
                    <button onClick={() => addView(DatabaseViewType.GALLERY)} className="p-1 hover:bg-gray-200 dark:hover:bg-[#333] rounded text-gray-500" title="Add Gallery View"><ImageIcon size={14} /></button>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-1 text-gray-500">
                    <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-[#333] rounded text-xs font-medium">
                        <Filter size={14} />
                        <span className="hidden sm:inline">Filter</span>
                    </button>

                    <button
                        className={`flex items-center gap-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-[#333] rounded text-xs font-medium ${activeSort ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        onClick={() => {
                            if (!activeSort) setActiveSort({ propertyId: 'name', direction: 'asc' });
                            else if (activeSort.direction === 'asc') setActiveSort({ propertyId: 'name', direction: 'desc' });
                            else setActiveSort(null);
                        }}
                    >
                        <ArrowUpDown size={14} />
                        <span className="hidden sm:inline">Sort {activeSort ? `(${activeSort.direction})` : ''}</span>
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 rounded text-xs font-medium" onClick={handleAddRow}>
                        <Plus size={14} />
                        <span className="hidden sm:inline">New</span>
                    </button>
                </div>
            </div>

            <div className="p-0 overflow-x-auto min-h-[200px] bg-white dark:bg-[#1e1e1e]">
                {renderView()}
            </div>
        </div>
    );
};
