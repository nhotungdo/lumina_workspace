
import React, { useState } from 'react';
import { ViewProps } from './types';
import { Plus } from 'lucide-react';
import { BlockType, DatabasePropertyType } from '../../../types';

export const TableView: React.FC<ViewProps> = ({ data, properties, onUpdateRow, onAddRow, onAddProperty, onUpdateProperty }) => {
    const [showPropMenu, setShowPropMenu] = useState(false);

    const handleCreateProp = (type: DatabasePropertyType) => {
        const name = prompt("Property Name:", type);
        if (name && onAddProperty) {
            onAddProperty(name, type);
        }
        setShowPropMenu(false);
    };

    return (
        <div className="min-w-full inline-block align-middle pb-20">
            <div className="border-t border-gray-200 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-[#252525]">
                        <tr>
                            {properties.map(prop => (
                                <th key={prop.id} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 dark:border-gray-800 w-[150px] min-w-[150px]">
                                    <div className="flex items-center gap-2">
                                        {prop.name}
                                    </div>
                                </th>
                            ))}
                            <th className="w-10 text-center relative border-r border-gray-200 dark:border-gray-800">
                                <button
                                    onClick={() => setShowPropMenu(!showPropMenu)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500"
                                >
                                    <Plus size={14} />
                                </button>
                                {showPropMenu && (
                                    <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-[#333] shadow-lg rounded-lg border dark:border-gray-700 z-50 py-1 text-left">
                                        {Object.values(DatabasePropertyType).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => handleCreateProp(type)}
                                                className="block w-full px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left capitalize"
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#1e1e1e] dark:divide-gray-800">
                        {data.map(row => (
                            <tr key={row.id} className="group hover:bg-gray-50 dark:hover:bg-[#252525]">
                                {properties.map(prop => {
                                    const value = row.metadata?.propertyValues?.[prop.id];
                                    return (
                                        <td key={prop.id} className="px-3 py-2 whitespace-nowrap text-sm border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200">
                                            {prop.type === DatabasePropertyType.TEXT && (
                                                <input
                                                    className="w-full bg-transparent border-none outline-none"
                                                    value={value || (prop.id === 'name' ? row.content : '')}
                                                    onChange={(e) => {
                                                        if (prop.id === 'name') onUpdateRow(row.id, { content: e.target.value });
                                                        else {
                                                            onUpdateRow(row.id, {
                                                                metadata: {
                                                                    ...row.metadata,
                                                                    propertyValues: {
                                                                        ...row.metadata?.propertyValues,
                                                                        [prop.id]: e.target.value
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }}
                                                />
                                            )}
                                            {prop.type === DatabasePropertyType.SELECT && (
                                                <div className="relative">
                                                    <input
                                                        list={`list-${prop.id}`}
                                                        className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 rounded text-xs w-full outline-none border border-transparent focus:border-blue-300 dark:focus:border-blue-700 transition-colors placeholder-blue-300/50 dark:placeholder-blue-200/50 font-medium"
                                                        placeholder="Select..."
                                                        value={value || ""}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            onUpdateRow(row.id, {
                                                                metadata: {
                                                                    ...row.metadata,
                                                                    propertyValues: {
                                                                        ...row.metadata?.propertyValues,
                                                                        [prop.id]: val
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                        onBlur={(e) => {
                                                            const val = e.target.value;
                                                            if (val && onUpdateProperty) {
                                                                const options = prop.options || [];
                                                                // Check if option exists (by name or id)
                                                                if (!options.find(o => o.name === val || o.id === val)) {
                                                                    // Create new option
                                                                    onUpdateProperty({
                                                                        ...prop,
                                                                        options: [...options, {
                                                                            id: val,
                                                                            name: val,
                                                                            color: 'blue' // Default color
                                                                        }]
                                                                    });
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <datalist id={`list-${prop.id}`}>
                                                        {prop.options?.map(opt => (
                                                            <option key={opt.id} value={opt.name} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            )}

                                            {/* CHECKBOX */}
                                            {prop.type === DatabasePropertyType.CHECKBOX && (
                                                <div className="flex justify-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                                                        checked={!!value}
                                                        onChange={(e) => {
                                                            onUpdateRow(row.id, {
                                                                metadata: {
                                                                    ...row.metadata,
                                                                    propertyValues: {
                                                                        ...row.metadata?.propertyValues,
                                                                        [prop.id]: e.target.checked
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* URL & EMAIL */}
                                            {(prop.type === DatabasePropertyType.URL || prop.type === DatabasePropertyType.EMAIL) && (
                                                <input
                                                    type="text"
                                                    className="w-full bg-transparent border-none outline-none text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                                    value={value || ""}
                                                    placeholder={prop.type === DatabasePropertyType.EMAIL ? "example@email.com" : "https://example.com"}
                                                    onChange={(e) => {
                                                        onUpdateRow(row.id, {
                                                            metadata: {
                                                                ...row.metadata,
                                                                propertyValues: {
                                                                    ...row.metadata?.propertyValues,
                                                                    [prop.id]: e.target.value
                                                                }
                                                            }
                                                        });
                                                    }}
                                                />
                                            )}

                                            {/* NUMBER */}
                                            {prop.type === DatabasePropertyType.NUMBER && (
                                                <input
                                                    type="number"
                                                    className="w-full bg-transparent border-none outline-none"
                                                    value={value || ""}
                                                    onChange={(e) => {
                                                        onUpdateRow(row.id, {
                                                            metadata: {
                                                                ...row.metadata,
                                                                propertyValues: {
                                                                    ...row.metadata?.propertyValues,
                                                                    [prop.id]: parseFloat(e.target.value)
                                                                }
                                                            }
                                                        });
                                                    }}
                                                />
                                            )}

                                            {/* DATE */}
                                            {prop.type === DatabasePropertyType.DATE && (
                                                <input
                                                    type="date"
                                                    className="w-full bg-transparent border-none outline-none text-gray-600 dark:text-gray-300"
                                                    value={value || ""}
                                                    onChange={(e) => {
                                                        onUpdateRow(row.id, {
                                                            metadata: {
                                                                ...row.metadata,
                                                                propertyValues: {
                                                                    ...row.metadata?.propertyValues,
                                                                    [prop.id]: e.target.value
                                                                }
                                                            }
                                                        });
                                                    }}
                                                />
                                            )}

                                            {/* PERSON (Simplified) */}
                                            {prop.type === DatabasePropertyType.PERSON && (
                                                <div className="flex items-center gap-1">
                                                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500">
                                                        👤
                                                    </div>
                                                    <input
                                                        className="flex-1 bg-transparent border-none outline-none text-sm"
                                                        placeholder="Name..."
                                                        value={value || ""}
                                                        onChange={(e) => {
                                                            onUpdateRow(row.id, {
                                                                metadata: {
                                                                    ...row.metadata,
                                                                    propertyValues: {
                                                                        ...row.metadata?.propertyValues,
                                                                        [prop.id]: e.target.value
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* MULTI-SELECT (Simplified textual for now) */}
                                            {prop.type === DatabasePropertyType.MULTI_SELECT && (
                                                <input
                                                    className="w-full bg-transparent border-none outline-none px-2 py-0.5 rounded text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                                    placeholder="Option 1, Option 2..."
                                                    value={value || ""}
                                                    onChange={(e) => {
                                                        onUpdateRow(row.id, {
                                                            metadata: {
                                                                ...row.metadata,
                                                                propertyValues: {
                                                                    ...row.metadata?.propertyValues,
                                                                    [prop.id]: e.target.value
                                                                }
                                                            }
                                                        });
                                                    }}
                                                />
                                            )}

                                            {/* Fallback for others */}
                                            {(prop.type !== DatabasePropertyType.TEXT &&
                                                prop.type !== DatabasePropertyType.SELECT &&
                                                prop.type !== DatabasePropertyType.DATE &&
                                                prop.type !== DatabasePropertyType.CHECKBOX &&
                                                prop.type !== DatabasePropertyType.URL &&
                                                prop.type !== DatabasePropertyType.EMAIL &&
                                                prop.type !== DatabasePropertyType.NUMBER &&
                                                prop.type !== DatabasePropertyType.PERSON &&
                                                prop.type !== DatabasePropertyType.MULTI_SELECT
                                            ) && (
                                                    <span className="text-gray-400 italic text-xs">{prop.type}</span>
                                                )}
                                        </td>
                                    );
                                })}
                                <td className="border-r border-gray-200 dark:border-gray-800"></td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={properties.length + 1} className="px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-500 border-t border-gray-200 dark:border-gray-800" onClick={onAddRow}>
                                <div className="flex items-center gap-2 text-sm">
                                    <Plus size={14} /> New
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
